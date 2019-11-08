export class HttpRequest {
  /**
   * 
   * @param {string} url 请求资源的url
   * @returns HttpResponse
   */
  public static doGet(url: string): HttpRequest {
    // 初始化 XMLHttpRequest 对象
    let xhr:XMLHttpRequest = new XMLHttpRequest()
    // XHR 的 open 函数的第3个参数true表示异步请求，false表示同步请求
    // 本函数是同步请求函数，因此为 false
    xhr.open('get', url, false, null, null)
    // 向服务器发送请求
    xhr.send()
    // 请求发送成功
    if (xhr.status === 200) {
      // 返回自己定义的 HttpResponse 接口对象
      // 这里可以看到接口的第二种用法
      // 并没有实现该接口，但是可以用打括号及键值对方式来定义接口（其实和js定义对象是一样的方式
      // 可以把这种接口当成纯数据类来处理
      return { success: true, responseType: ' text ', response: xhr.response }
    } else {
      // 请求失败，success 标记为falase，response 返回null
      return { success: false, responseType: " text ", response: null }
    }
  }
  public static doGetAsync (url: string, callback: (response: HttpResponse) => void, responseType: XMLHttpRequestResponseType = 'text'): void {
    let xhr: XMLHttpRequest = new XMLHttpRequest()
    // 在doGet同步请求中，不允许设置要请求的资源是文本，JSON，还是二进制类型
    // 异步请求中，却可以自己决定请求 text，json，arraybuffer，blob和document等类型
    xhr.responseType = responseType // 这句话在doGet中会报错
    xhr.onreadystatechange = (ev: Event): void => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // 异步请求成功，返回标记成功的HttpResponse对象，response为请求资源数据
        let response:HttpResponse = {
          success: true,
          responseType: responseType,
          response: xhr.response,
        }
        // 并且调用回调函数
        callback(response)
      }
      else {
        // 异步请求失败，返回标记失败的HttpResponse对象，response为null
        let response:HttpResponse = {
          success: false,
          responseType: responseType,
          response: null
        }
        callback(response)
      }
    }
    // open 第三个参数用来设置是同步还是异步请求，本函数设置为true,表示异步请求
    xhr.open('get', url, true, null, null)
    xhr.send()
  }
}

export interface HttpResponse {
  success: Boolean; // http 请求成功，返回 true，否则返回 false
  responseType: XMLHttpRequestResponseType; // 返回请求的资源类型 buffer blob 返回的是二进制文件
  response: any; // 更具请求的类型不同，可能返回的是字符串，ArrayBuffer 或Blob对象，因此使用any类型
}