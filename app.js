import { serverHttp } from "./backend/http.js";

import "./backend/websocket.js"

serverHttp.listen(process.env.PORT || 3000, () => {
    console.log('App is running at port 3000...');
});