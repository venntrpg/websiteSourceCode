import instance from '@/api/apiInstance'

const getTodoTitle = count => {
  return instance
    .get(`/todos/${count}`)
    .then(response => {
      // console.log(response)
      return response.data
    })
}

export default {
  getTodoTitle
}
