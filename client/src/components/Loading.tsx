import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
