import EditProfileModal from "@/components/Modals/EditProfileModal";
import NoResults from "@/components/NoResults";
import VideoCard from "@/components/VideoCard";
import useAuthStore from "@/store/authStore";
import { IUser, Video } from "@/types";
import { BASE_URL } from "@/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import {AiOutlineEdit } from "react-icons/ai";
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
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className="w-16 h-16 md:w-32 md:h-32">
          <Image
            width={120}
            height={120}
            layout="responsive"
            className="rounded-full"
            src={user.image}
            alt="user-profile"
          />
          {userProfile && user.username === userProfile?.username &&(
            <AiOutlineEdit size={25} onClick={() => setshowEditProfileModal(true)} className=" text-[#0097b2] cursor-pointer" />
          )}
        </div>

        <div>
          <div className="text-md md:text-2xl font-bold tracking-wider flex gap-2 items-center justify-center lowercase">
            <span>{user.username.replace(/\s+/g, "")} </span>
            <GoVerified className="text-blue-400 md:text-xl text-md" />
          </div>
          <p className="text-sm font-medium"> {user.username}</p>
        </div>
      </div>
      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p
            className={`text-xl font-semibold cursor-pointer ${videos} mt-2`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer ${liked} mt-2`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>
        <div className="flex gap-6 flex-wrap md:justify-start">
          {videoList.length > 0 ? (
            videoList.map((post: Video, idx: number) => (
              <VideoCard key={idx} post={post} />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideos ? "" : "Liked"} Videos Yet`}
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
    return {
      props: { data: res.data },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { data: null },
    };
  }
};
export default Profile;
