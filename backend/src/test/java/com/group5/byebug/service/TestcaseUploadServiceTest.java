package com.group5.byebug.service;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TestcaseUploadServiceTest {
    private final TestcaseUploadService service = new TestcaseUploadService(null);

    @Test
    void buildsProblemObjectKey() {
        assertEquals("problems/42/tests.zip", TestcaseUploadService.objectKeyFor(42L));
    }

    @Test
    void rejectsEmptyTestsZip() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "tests.zip",
                "application/zip",
                new byte[0]
        );

        assertThrows(RuntimeException.class, () -> service.uploadTestsZip(42L, file));
    }

    @Test
    void rejectsNonZipFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "tests.txt",
                "text/plain",
                "hello".getBytes()
        );

        assertThrows(RuntimeException.class, () -> service.uploadTestsZip(42L, file));
    }

    @Test
    void rejectsTestsZipOver100Mb() {
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                service.uploadTestsZip(42L, oversizedTestsZip())
        );

        assertTrue(exception.getMessage().contains("100MB"));
    }

    private MultipartFile oversizedTestsZip() {
        return new MultipartFile() {
            @Override
            public String getName() {
                return "file";
            }

            @Override
            public String getOriginalFilename() {
                return "tests.zip";
            }

            @Override
            public String getContentType() {
                return "application/zip";
            }

            @Override
            public boolean isEmpty() {
                return false;
            }

            @Override
            public long getSize() {
                return TestcaseUploadService.MAX_TESTS_ZIP_SIZE_BYTES + 1;
            }

            @Override
            public byte[] getBytes() {
                return new byte[] {1};
            }

            @Override
            public InputStream getInputStream() {
                return new ByteArrayInputStream(new byte[] {1});
            }

            @Override
            public void transferTo(java.io.File dest) throws IOException, IllegalStateException {
                throw new UnsupportedOperationException("Not needed for validation test");
            }
        };
    }
}
