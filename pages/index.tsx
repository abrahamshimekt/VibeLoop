import axios from "axios";
import { Video } from "../types";
import NoResults from "@/components/NoResults";
import VideoCard from "@/components/VideoCard";
import { BASE_URL } from "@/utils";
import { MdOutlineVideocamOff } from "react-icons/md";
interface IProps {
  videos: Video[];
}
const Home = ({ videos }: IProps) => {
  return (
    <div className="flex flex-col  gap-10 vidoes h-full">
      {videos.length ? (
        videos.map((video: Video) => <VideoCard post={video} key={video._id} />)
      ) : (
        <NoResults text="No Videos" icon={MdOutlineVideocamOff} />
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  try {
    let response = null;
    if (topic) {
      response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
    } else {
      response = await axios.get(`${BASE_URL}/api/post`);
    }
    return { props: { videos: response?.data } };
  } catch (error) {
    console.log(error);
    return { props: { videos: [] } };
  }
};

export default Home;
