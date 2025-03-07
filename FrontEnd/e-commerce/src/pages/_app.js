import { Provider } from "react-redux";
import store from "@/redux/store";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
