# PocketBase do ambiente de staging (Railway). Separado do PocketBase de produção.
FROM alpine:3.20

ARG PB_VERSION=0.26.6

RUN apk add --no-cache unzip ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip

COPY entrypoint.sh /pb/entrypoint.sh
RUN chmod +x /pb/entrypoint.sh

EXPOSE 8080

CMD ["/pb/entrypoint.sh"]
