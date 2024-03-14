FROM python:3.12.1
 
# Set the working directory inside the container to /DASHBOARD/app/Kafka/Producer/.
WORKDIR /Project/Kafka/producer/
 
# Copy the contents of the current directory into the above mentioned container's workdir.
COPY . /Project/Kafka/producer/
 
# Run the pip install command inside the container to install the specified Python packages.
RUN pip install python-dotenv confluent_kafka
 
# Whenever the container runs, this default command will be executed.
CMD ["python", "producer.py"]