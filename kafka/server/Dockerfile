# Fetches the image of Python 3.11.4 from the Docker Hub
FROM python:3.12.1
 
# Set the working directory inside the container to /DASHBOARD/app/Kafka/Server/.
WORKDIR /Project/Kafka/server/
 
# Copy the contents of the current directory into the above mentioned container's workdir.
COPY . /Project/Kafka/server/
 
# Run the pip install command inside the container to install the specified Python packages.
RUN pip install python-dotenv
 
# Expose port 12345 to allow communication to/from the container.
EXPOSE 12345
 
# Whenever the container runs, this default command will be executed.
CMD ["python", "server.py"]