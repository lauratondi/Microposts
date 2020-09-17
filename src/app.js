import { http } from './http';
import { ui } from './ui';

// GET post on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

function getPosts() {
  http
    .get('http://localhost:3000/posts')
    .then((data) => ui.showPost(data))
    .catch((err) => console.log(err));
}
