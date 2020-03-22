# https://misfra.me/2019/10/using-ansible-with-github-actions/
FROM alpine

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]