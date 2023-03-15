function fetchGallery (page, search) {
    const KEY_API = '34362001-d5ec89d1d84675fe0e9033f4a';

    return fetch(`https://pixabay.com/api/?q=${search}&page=${page}&key=${KEY_API}&image_type=photo&orientation=horizontal&per_page=12`)
            .then(res => {
                if (res.ok) {
                return res.json();
                }

                return Promise.reject(new Error('Error'))
            })
}
const api = {
    fetchGallery,
}
export default api;