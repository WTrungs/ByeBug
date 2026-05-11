FROM gcc:13-bookworm

WORKDIR /sandbox

RUN useradd -m judge

RUN chown -R judge:judge .

USER judge

CMD ["tail", "-f", "/dev/null"]