// Globals
axios.defaults.headers.common["X-Auth-Token"] =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// GET REQUEST
function getPosts() {
  // Get Request Pertama
  /*axios({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/posts",
    params: {
      _limit= 5,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));*/

  // GET Best Practice
  axios
    .get("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then((res) => {
      console.log(res.data);
      showOutput(res);
    })
    .catch((err) => console.log(err));
}

// POST REQUEST
function addPost() {
  axios
    .post("https://jsonplaceholder.typicode.com/posts", {
      title: "testing",
      body: "testing body",
      userId: 1,
    })
    .then((res) => {
      console.log(res.data);
      showOutput(res);
    })
    .catch((err) => console.log(err));
}

// PUT/PATCH REQUEST
function updatePost() {
  axios
    .put("https://jsonplaceholder.typicode.com/posts/1", {
      title: "update testing",
      body: "update testing body",
      userId: 1,
    })
    .then((res) => {
      console.log(res.data);
      showOutput(res);
    })
    .catch((err) => console.log(err));
}

// DELETE REQUEST
function removePost() {
  axios.delete("https://jsonplaceholder.typicode.com/posts/1").then((res) => {
    console.log(res.data);
    showOutput(res);
  });
}

// SIMULTANEOUS DATA
function getData() {
  // axios
  //   .all([
  //     axios.get("https://jsonplaceholder.typicode.com/posts"),
  //     axios.get("https://jsonplaceholder.typicode.com/users"),
  //   ])
  //   .then((res) => {
  //     console.log(res[0]);
  //     console.log(res[1]);
  //     showOutput(res[0]);
  //   })
  //   .catch((err) => console.log(err));

  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/posts"),
      axios.get("https://jsonplaceholder.typicode.com/users"),
    ])
    .then(
      axios.spread((posts, users) => {
        console.log(posts.data);
        console.log(users.data);
        showOutput(posts);
      })
    )
    .catch((err) => console.log(err));
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken",
    },
  };
  axios
    .post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        title: "testing",
        body: "testing body",
        userId: 1,
      },
      config
    )
    .then((res) => {
      console.log(res.data);
      showOutput(res);
    })
    .catch((err) => console.log(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/posts",
    data: {
      title: "testing transform",
      body: "testing body transform",
      userId: 1,
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };
  axios(options).then((res) => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/post?_limit=5")
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        // server respond with a status other then 200 range
        console.log(err.response.data);
        console.log(err.response.status);
      } else if (err.request) {
        // Request was made but no response
        console.log(err.request);
      } else {
        console.log(err.messege);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios
    .get("https://jsonplaceholder.typicode.com/post?_limit=5", {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log("Request Canceled", err.message);
      }
    });
  if (true) {
    source.cancel("request Canceled");
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  (config) => {
    console.log(`${config.method.toUpperCase()} request sent to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

axiosInstance.get("/posts").then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Event listeners
document.getElementById("get").addEventListener("click", getPosts);
document.getElementById("post").addEventListener("click", addPost);
document.getElementById("update").addEventListener("click", updatePost);
document.getElementById("delete").addEventListener("click", removePost);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
