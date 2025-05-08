# #!/bin/bash

# Start a virtual frame buffer in the background for headless environments & Start the development server using npm in the background & Wait until the specified URL (http://host.docker.internal:3000) is accessible before proceeding
Xvfb :99 -screen 0 1280x1024x16 & npm start & wait-on http://localhost:3001 & npx cypress run 

EXIT_CODE=$?

# Exit the script with the captured exit code to indicate success or failure.

exit $EXIT_CODE
