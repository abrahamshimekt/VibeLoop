import useAuthStore from "@/store/authStore";
import { BASE_URL } from "@/utils";
import { client } from "@/utils/client";
import { SanityAssetDocument } from "@sanity/client";
import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
interface IProps {
  showEditProfileModal: boolean;
  setShowEditProfileModal: Dispatch<SetStateAction<boolean>>;
}
const EditProfileModal = ({
  showEditProfileModal,
  setShowEditProfileModal,
}: IProps) => {
  const router = useRouter();
  const { id } = router.query;
  const{addUser} = useAuthStore();
  const [username, setUsername] = useState("");
  const [uploading,setUploading] = useState(false);
  const [imageAsset, setImageAsset] = useState<SanityAssetDocument | undefined>();
 
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setUploading(true);
      client.assets.upload("file", event.target.files[0], {
        contentType: selectedFile.type,
        filename: selectedFile.name,
      }).then((data)=>{
        setImageAsset(data);
        setUploading(false);

      });
    }
  };
  const handleSave = async () => {
    if (username && imageAsset?._id) {
      const response = await axios.put(`${BASE_URL}/api/profile/${id}`, {
        username,
        image:imageAsset.url
      });
      addUser(response.data);
      setShowEditProfileModal(false);
    }
  };
  return (
    <div
      id="default-modal"
      className={`${showEditProfileModal ? "flex" : "hidden"} justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50`}
    >
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 ">
        <h2 className="text-2xl font-semibold mb-4 ">Edit Profile</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2 "
            htmlFor="file"
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="file"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowEditProfileModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-[#43d2ec] rounded-lg hover:bg-[#0097b2]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
