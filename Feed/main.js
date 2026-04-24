const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

class Feed {
  constructor() {
    this.page = 1;
    this.limit = 10;
    this.query = "";
    this.isLoading = false;
    this.hasMore = true;

    this.searchInput = document.querySelector("#search-input");
    this.feedContainer = document.querySelector("#feed-container");
    this.loader = document.querySelector("#loader");
    this.emptyMessage = document.querySelector("#empty-message");
    this.errorMessage = document.querySelector("#error-message");

    this.init();
  }

  init = () => {
    this.searchInput.addEventListener(
      "input",
      debounce(this.handleSearch, 300),
    );

    this.observer = new IntersectionObserver(this.handleIntersect, {
      rootMargin: "100px",
    });
    this.observer.observe(this.loader);

    this.fetchPosts();
  };

  handleSearch = (event) => {
    this.query = event.target.value.trim();

    this.page = 1;
    this.hasMore = true;
    this.feedContainer.innerHTML = "";

    this.fetchPosts();
  };

  handleIntersect = (entries) => {
    const target = entries[0];

    if (target.isIntersecting && !this.isLoading && this.hasMore) {
      this.page++;
      this.fetchPosts();
    }
  };

  fetchPosts = async () => {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    this.loader.style.display = "block";
    this.errorMessage.style.display = "none";
    this.emptyMessage.style.display = "none";

    try {
      let url = `https://jsonplaceholder.typicode.com/posts?_page=${this.page}&_limit=${this.limit}`;

      if (this.query) {
        url += `&q=${encodeURIComponent(this.query)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const posts = await response.json();

      if (posts.length === 0) {
        this.hasMore = false;
        if (this.page === 1) {
          this.emptyMessage.style.display = "block";
        }
      } else {
        this.renderPosts(posts);

        if (posts.length < this.limit) {
          this.hasMore = false;
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      this.errorMessage.style.display = "block";
      this.hasMore = false;
    } finally {
      this.isLoading = false;

      if (!this.hasMore) {
        this.loader.style.display = "none";
      }
    }
  };

  renderPosts = (newPosts) => {
    const html = newPosts.reduce((acc, post) => {
      return (
        acc +
        `
                <div class="post-card">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-body">${post.body}</p>
                </div>
            `
      );
    }, "");

    this.feedContainer.insertAdjacentHTML("beforeend", html);
  };
}

const app = new Feed();
