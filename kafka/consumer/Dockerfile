# Set the base image to use for this Dockerfile
FROM python:3.12.1
 
# Set the working directory inside the container to /DASHBOARD/app/Kafka/Consumer/
WORKDIR /Project/Kafka/consumer/
 
# Copy the contents of the current directory into the container's /DASHBOARD/app/Kafka/Consumer/ directory
COPY . /Project/Kafka/consumer/
 
# Install Python dependencies using pip inside the container
RUN pip install python-dotenv confluent_kafka pymongo
 
# Define the default command to be executed when the container starts
CMD ["python", "consumer.py"]