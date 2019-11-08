import { HttpRequest, HttpResponse } from '../utils/async-ajax.ts'

const response: HttpResponse = HttpRequest.doGet('http://localhost:3000/data.txt')
console.log('response: ', response)
processHttpResponse(response)

HttpRequest.doGetAsync('http://localhost:3000/data.txt', processHttpResponse)

function processHttpResponse (response: HttpResponse): void {
  if (response.success === true) {
    // 将response转换为string类型，因为直到是文本文件
    const str = response.response as string
  
    console.log('str: ', str)
  }
}