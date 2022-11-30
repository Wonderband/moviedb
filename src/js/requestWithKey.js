import axios from 'axios';

export default request =>
  axios.get(request, {
    params: { api_key: '0fd1ddf45233c721325ad47f082cd332' },
  });
