// https://contactmentor.com/how-to-add-loading-spinner-react-js/
// https://code-boxx.com/full-screen-css-loading-spinner/#sec-download
// https://stackoverflow.com/questions/44371716/add-animated-gifs-to-react-web-apps
// import clsx from "clsx";
// import { HTMLAttributes } from "react";
import "./spinner.css"

// const styles =
//   "bg-blue-100 border border-blue-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium hover:bg-blue-200";

// export type ButtonProps = Pick<HTMLAttributes<{}>, "className" | "onClick" | "children">;


export function Spinner() {
  return (
    <div id="spinner" className="show">
      <img src={require('./load.gif')} alt="loading..." />
    </div>
  );
}
