import bodyParser from 'body-parser';


type NextHandleFunction = ReturnType<typeof bodyParser['urlencoded']>;


export const urlencodedParser: NextHandleFunction = bodyParser.urlencoded({ extended: false });


export const jsonParser: NextHandleFunction = bodyParser.json();
