FROM python:3.8.5

WORKDIR /app

COPY . .

RUN pip install -r requirement.txt
RUN apt-get update && apt-get install -y libgl1-mesa-glx && apt-get install -y awscli
VOLUME /app/files
COPY credentials /root/.aws/credentials
COPY config /root/.aws/config



EXPOSE 7000

CMD python ./app.py
