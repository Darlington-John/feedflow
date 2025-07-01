import { useParams } from "next/navigation";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuthContext } from "~/app/context/auth-context";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import { member_type } from "~/lib/types/member";
import { apiRequest } from "~/lib/utils/api-request";
interface MenuProps {
  member: member_type;
  active: boolean;
  visible: boolean;
  disableToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMenu: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}
const MemberMenu = ({
  member,
  active,
  visible,
  disableToggle,
  ref,
  toggleMenu,
}: MenuProps) => {
  const { team_id } = useParams();
  const [deleting, setDeleting] = useState(false);
  const [sucessful, setSucessful] = useState(false);
  const { user } = useAuthContext();
  const deleteMember = async () => {
    if (deleting) {
      return;
    }
    if (!user) {
      return;
    }
    setDeleting(true);
    disableToggle(true);
    await apiRequest({
      url: `/api/teams/${team_id}/delete-memberback`,
      method: "DELETE",
      body: { userId: user?._id, memberId: member?._id },
      onSuccess: (res) => {
        setSucessful(true);
        toast.success(res.message, {
          icon: <FaCheck color="white" />,
        });

        setTimeout(() => {
          toggleMenu();
          setSucessful(false);
          window.dispatchEvent(new CustomEvent("refreshmemberbacks"));
        }, 3000);
      },
      onError: (error) => {
        toast.error(error);
      },
      onFinally: () => {
        disableToggle(false);
        setDeleting(false);
      },
    });
  };
  return (
    active && (
      <div
        className={`w-[100px]     mid-popup   duration-150  flex flex-col rounded-lg bg-navy   items-center  rounded-full absolute  top-10  right-2   shadow-xl z-10 border border-grey  gap-1 rounded-sm overflow-hidden  ${
          visible ? "" : "mid-popup-hidden"
        }`}
        ref={ref}
      >
        <AsyncButton
          action="Delete member"
          classname_overide="!h-8 !rounded-none !bg-transparent hover:!bg-grey  hover:!ring-0 !text-xs"
          loading={deleting}
          success={sucessful}
          onClick={deleteMember}
        />
        {member.superAdminIds.includes(user?._id as string) && (
          <AsyncButton
            action="Make an admin"
            classname_overide="!h-8 !rounded-none !bg-transparent hover:!bg-grey  hover:!ring-0  !text-xs"
            loading={deleting}
            success={sucessful}
            onClick={deleteMember}
          />
        )}
      </div>
    )
  );
};

export default MemberMenu;
