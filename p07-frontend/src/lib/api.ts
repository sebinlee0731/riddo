import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

// BE 의 글로벌 exception filter 가 내려보내는 error envelope 의 message 를
// AxiosError.message 에 끌어올린다. 결과: 컴포넌트가 단순히 error.message 만
// 읽어도 사용자 친화 메시지(예: "문서에서 색인 가능한 텍스트를 찾지 못했습니다.")
// 가 나오고, 디폴트의 "Request failed with status code 400" 노출이 사라진다.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const data = error.response?.data as
        | { error?: { message?: string } }
        | undefined;
      const beMessage = data?.error?.message;
      if (typeof beMessage === "string" && beMessage.length > 0) {
        error.message = beMessage;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
