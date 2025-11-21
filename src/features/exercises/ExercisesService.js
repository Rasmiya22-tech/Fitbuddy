import api from '../../api/apiClient';

export default {
  getExercises: async () => {
    const { data } = await api.get('/products?limit=15');
    return data.products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.thumbnail,
      status: p.rating > 4 ? 'Popular' : 'Active'
    }));
  }
};
