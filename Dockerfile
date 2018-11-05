FROM node:8.10.0

EXPOSE 8000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.3.0/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm run hotreload