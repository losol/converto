# Converto Strapi Plugin

Converto Strapi Plugin is a Strapi plugin for converting HTML to PDF. It can take either raw HTML or an URL as input, and will return an PDF generated on headless Chrome (Puppeteer).

To run this on own machine, download the [Strapi with Converto from Github](https://github.com/losol/converto). 

To get started: 
1. Clone the repo
2. Run Strapi with Converto with the command `npx strapi develop`
3. Login on `localhost:1337/admin`, and create a new user. For example with email `asdf@asdf.com`, and password `asdfasdf`.
4. Go to roles and permissions, and add Converto - Html2Pdf - convert to the allow conversions for this user. 
5. Use Postman or your preferred client to get an jwt token by sending the credentials to `localhost:1337/auth/local``
6. Add the jwt token to the header as a bearer token, and send your request to `localhost:1337/convert/html/to/pdf``

Find more [documentation on the API, with an Postman Collection](https://documenter.getpostman.com/view/863421/SWLZeUzS?version=latest). 