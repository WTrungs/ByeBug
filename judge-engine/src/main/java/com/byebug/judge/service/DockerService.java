package com.byebug.judge.service;

import java.io.File;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Frame;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.StreamType;
import com.github.dockerjava.api.model.Volume;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DockerService {

    private final DockerClient dockerClient;

    @Value("${judge.docker.images.cpp}")
    private String cppImage;

    @Value("${judge.docker.dockerfiles.cpp}")
    private String cppDockerfilePath;

    public void buildImage(String language) { //Ham build image cho tung ngon ngu
        String imageTag = switch (language.toLowerCase()) {
            case "cpp" -> cppImage;
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };

        String dockerfilePath = switch (language.toLowerCase()) {
            case "cpp" -> cppDockerfilePath;
            default -> "";
        };

        log.info("Starting to build Docker image: {} from path: {}", imageTag, dockerfilePath);

        try {
            dockerClient.buildImageCmd() //Build ra image
                    .withDockerfile(new File(dockerfilePath + "Dockerfile"))
                    .withPull(true)
                    .withTags(Collections.singleton(imageTag))
                    .exec(new BuildImageResultCallback())
                    .awaitCompletion(5, TimeUnit.MINUTES);
            
            log.info("Successfully built image: {}", imageTag);
        } catch (InterruptedException e) {
            log.error("Image build interrupted", e);
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.error("Failed to build Docker image: {}", imageTag, e);
        }
    }

    public String createContainer(String language, String hostPath, Long memoryLimit) { //Tao container
        String image = switch (language.toLowerCase()) {
            case "cpp" -> cppImage;
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };

        HostConfig hostConfig = HostConfig.newHostConfig()
                .withBinds(new Bind(hostPath, new Volume("/sandbox")))
                .withMemory(memoryLimit * 1024 * 1024) // 256MB RAM
                .withMemorySwap(memoryLimit * 1024 * 1024) // Khong cho dung swap
                .withPidsLimit(100L) // Tranh Fork Bomb bang cach gioi han tien trinh
                .withNetworkMode("none") // Ngat mang tranh gian lan
                .withAutoRemove(false); // Xoa thu cong container sau khi cham

        String containerId = dockerClient.createContainerCmd(image)
                .withHostConfig(hostConfig)
                .withWorkingDir("/sandbox")
                .withCmd("tail", "-f", "/dev/null") //Lenh chay lien tuc de giu container luon chay
                .exec().getId();

        dockerClient.startContainerCmd(containerId).exec();
        log.info("Created container {} for path {}", containerId, hostPath);
        return containerId;
    }

    public String execCommand(String containerId, Long timeoutSeconds, String... cmd) { //Chay code gi do o trong container
        ExecCreateCmdResponse exec = dockerClient.execCreateCmd(containerId)
                .withCmd(cmd)
                .withAttachStdout(true)
                .withAttachStderr(true)
                .exec();

        //Hung du lieu thuc thu command vao stdout va stderr
        StringBuilder stdout = new StringBuilder();
        StringBuilder stderr = new StringBuilder();

        try {
            boolean completed = dockerClient.execStartCmd(exec.getId())
                    .exec(new ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame frame) {
                            if (frame.getStreamType() == StreamType.STDOUT) {
                                stdout.append(new String(frame.getPayload()));
                            } else if (frame.getStreamType() == StreamType.STDERR) {
                                stderr.append(new String(frame.getPayload()));
                            }
                            super.onNext(frame);
                        }
                    })
                    .awaitCompletion(timeoutSeconds, TimeUnit.SECONDS);

            if (!completed) {
                return "TIME_LIMIT_EXCEEDED";
            }
        } catch (InterruptedException e) {
            log.error("Execution interrupted", e);
            Thread.currentThread().interrupt();
            return "INTERRUPTED";
        }

        if (stderr.length() > 0) {
            return "ERROR: " + stderr.toString();
        }

        return stdout.toString().trim(); //Tra ve ket qua
    }
    
    public void stopAndRemoveContainer(String containerId) { //Don dep container
        try {
            dockerClient.stopContainerCmd(containerId).withTimeout(1).exec(); //Dung container
            dockerClient.removeContainerCmd(containerId).withForce(true).exec(); //Xoa container
            log.info("Successfully removed container {}", containerId);
        } catch (Exception e) {
            log.error("Failed to remove container {}", containerId, e);
        }
    }
}