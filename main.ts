import { Server } from 'http';
import express from 'express'
import path from 'path';
import dbConnection from './src/config/database';
import dotenv from 'dotenv';
import Routes from './src';
import i18n from 'i18n';
import hpp from 'hpp';

const app: express.Application = express();
app.use(express.json({limit : '10kb'}));

let server : Server;
dotenv.config();

app.use(hpp({
  whitelist : ['price']
}));

i18n.configure({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
})

app.use(i18n.init);

dbConnection();
Routes(app);

app.get('/', function (req : express.Request, res: express.Response) : void {
  res.send('Hello World !!')
})


// app.get('/',categoriesService.getAllCategories);

server = app.listen(process.env.PORT, ()  => {
    console.log(`Server running on port ${process.env.PORT} `);

})

    process.on('unhandledRejection', (err : Error)  => {
    console.log  (`unhandledRejection ${err.name} | ${err.message}`);
    server.close(()  => {
        
        console.log('shutting down the server ');
        process.exit(1);
    
    })
  })
