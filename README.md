# TaleWeaver

## **Team** 201-Created

### Link
- Check out taleweaver here: [taleweaver.me](https://taleweaver.me)
- Here's a video link to our demo: [Click here](https://www.youtube.com/watch?v=4nU_HVw5qvE)

### Team Members

1. Elham Badri - elham.badri@mail.utoronto.ca
2. Yuxin Chen - katy.chen@mail.utoronto.ca

### Brief Description of the Web Application

TaleWeaver is a web application that allows users to create personalized picture books. Users can write or input their stories, and the application will use AI to generate custom images for each scene. The completed storybooks. You will also be able work together with a team to create picture books, generate a picture book given a prompt, and generate voiceovers for picture books

### How to Fulfill Required Elements

- **Frontend Framework:** Use Angular to create a Single Page Application (SPA).
- **Backend Framework: E**xpress.js as the core backend API to handle data storage, retrieval, and processing.
- **Database**: Postgres, using sequelize as an ORM
- **RESTful API:** Ensuring that the application's API follows RESTful principles for efficient and organized communication.
- **Deployment:** Deploy the application on a Virtual Machine on Google Cloud using Docker, Docker compose and GitHub actions
- **General public:** It will be deployed on a Virtual Machine where anyone can access
- **Third-Party API:**
    - Integrate with an image generation API for generating images (gpt api)
    - text generation api for generating the story (if needed) (gpt api)
    - text-to-speech api for reading out the book (gcp)
- **OAuth 2.0:** Implementing OAuth 2.0 as the authorization mechanism to ensure secure user authentication and authorization (google for login).

### How to Fulfill Additional Requirements

- **Real-Time Features:** Implement real-time features so that multiple users can work on a book at the same time.
- **Long-Running Task:** Give the app a simple title and description and it will create the whole storybook for you
    - potentially the voice generation may take long too.

### Milestones

- **Alpha Version**
    - Set up the project repository and development environment.
    - Implement user authentication using OAuth 2.0.
    - Design and create database models for users and stories
    - Develop basic backend endpoints with Express.js for user management and story creation.
    - Create the initial frontend layout with Angular, including user login and story input forms.
    - Integrate the image generation API for initial text-to-image generation.
    - Create a Mockup for ui
- **Beta Version**
    - Complete core functionalities for creating and editing storybooks.
    - Implement real-time collaboration features
    - Integrate text-to-speech functionality using the Google Cloud API.
    - Develop the long-running task feature to generate entire storybooks based on a prompt.
    - Conduct initial testing and fix major bugs.
    - Deploy the application using Docker and Docker Compose, ensuring it is accessible on a Virtual Machine.
- **Final Version**
    - Finalize all features, finalize styling
    - Conduct thorough testing and debugging to ensure
    - Prepare and record a 3-minute video demo showcasing the core features of the application.
    - Upload the video demo to YouTube and include the link in the README.md file.
    - Ensure the application is fully deployed to Lightsail.
    - Ensure all code and deployment files are pushed to the main branch of the GitHub
