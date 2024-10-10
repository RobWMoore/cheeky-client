# Use a lightweight web server as the base image
FROM nginx:alpine

# Copy the web content into the default directory
COPY ./web /usr/share/nginx/html

# Expose port 80 to access the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
