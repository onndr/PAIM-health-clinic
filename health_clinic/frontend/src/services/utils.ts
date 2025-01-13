import env from "react-dotenv";

var backendUrl: string = env.FLASK_BACKEND || 'error_backend_url';

export default backendUrl;