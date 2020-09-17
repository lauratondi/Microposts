import { http } from './http';
import { ui } from './ui';

// GET post on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

// Listen for Edit State
document.querySelector('#posts').addEventListener('click', enableEdit);

// Listen for cancel (updateButton)
document.querySelector('.card-form').addEventListener('click', cancelEdit);

// GET posts
function getPosts() {
  http
    .get('http://localhost:3000/posts')
    .then((data) => ui.showPost(data))
    .catch((err) => console.log(err));
}

// Submit post (POST)
function submitPost() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  const data = {
    title: title,
    body: body,
  };

  if (title === '' || body === '') {
    ui.showAlert('Please fill in all fields', 'alert alert-danger');
  } else {
    // Check for ID
    if (id === '') {
      // Create post
      http
        .post('http://localhost:3000/posts', data)
        .then((data) => {
          ui.showAlert('Post added', 'alert alert-success');
          ui.clearFields();
          getPosts();
        })
        .catch((err) => console.log(err));
    } else {
      // Update post
      http
        .put(`http://localhost:3000/posts/${id}`, data)
        .then((data) => {
          ui.showAlert('Post updated', 'alert alert-success');
          ui.changeFormState('add');
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
}

// DELETE post
function deletePost(e) {
  if (e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id;
    if (confirm('Are you sure?')) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then((data) => {
          ui.showAlert('Post Removed', 'alert alert-success');
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
  e.preventDefault();
}

// Enable EDIT State
function enableEdit(e) {
  if (e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id;
    const title =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    const body = e.target.parentElement.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body,
    };
    // Fill from with current post
    ui.fillForm(data);
  }

  e.preventDefault();
}

// Cancel Edit State
function cancelEdit(e) {
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }
  e.preventDefault();
}
