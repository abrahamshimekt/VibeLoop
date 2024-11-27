import EditProfileModal from "@/components/Modals/EditProfileModal";
import NoResults from "@/components/NoResults";
import VideoCard from "@/components/VideoCard";
import useAuthStore from "@/store/authStore";
import { IUser, Video } from "@/types";
import { BASE_URL } from "@/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GoVerified } from "react-icons/go";
import { MdOutlineVideocamOff } from "react-icons/md";
interface IProps {
  data: {
    user: IUser; 
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}
const Profile = ({ data }: IProps) => {
  const { user, userVideos, userLikedVideos } = data;
  const { userProfile } = useAuthStore();
  const [showUserVideos, setShowUserVideos] = useState(false);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [showEditProfileModal, setshowEditProfileModal] = useState(false);
  const videos = showUserVideos ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideos ? "border-bp-2 border-black" : "text-gray-400";
  useEffect(() => {
    if (showUserVideos) {
      setVideoList(userVideos);
    } else {
      setVideoList(userLikedVideos);
    }
  }, [showUserVideos, userLikedVideos, userVideos]);
  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex gap-10 bg-white w-full">
          <div className="w-16 h-16 md:w-32 md:h-32">
            <Image
              src={user.image}
              width={120}
              height={120}
              className="rounded-full"
              alt="User Profile"
              layout="responsive"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className=" md:text-2xl tracking-wider flex gap-1 items-center justify-center text-md font-bold text-primary lowercase">
              {user?.username?.replace(" ", "")}
              <GoVerified className="text-blue-400" />
            </p>
            <p className=" md:text-xl capitalize text-gray-400 text-sm">
              {user.username}
            </p>
          </div>
        </div>
        {userProfile && (
          <button
            className="bg-[#F51997] w-36  p-2 text-white font-semibold rounded-md border-2"
            onClick={() => setshowEditProfileModal(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      <div>
        <div
          className="flex gap-10 mb-10 mt-10
      border-b-2 border-gray-200 bg-white w-full"
        >
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>
        <div className="flex gap-6 flex-wrap md:justify-start">
          {videoList.length > 0 ? (
            videoList.map((post: Video, index: number) => (
              <VideoCard post={post} key={index} />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideos ? "" : "Liked Videos Yet!"}`}
              icon={MdOutlineVideocamOff}
            />
          )}
        </div>
      </div>
      <EditProfileModal
        showEditProfileModal={showEditProfileModal}
        setShowEditProfileModal={setshowEditProfileModal}
      />
    </div>
  );
};
export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/profile/${id}`);
    console.log(">>>>>>>>>>>>>>>result:",res);
    return {
      props: { data: res.data },
    };
  } catch (error) {
    return {
      props: { data: null },
    };
  }
};
export default Profile;
