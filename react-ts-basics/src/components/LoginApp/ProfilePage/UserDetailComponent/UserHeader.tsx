import editPicture from '../../../LoginApp/assets/edit-image.svg'

type UserHeaderProps = {
  editBtnClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isEdited: boolean;
}

export default function UserHeader({ editBtnClick, isEdited }: UserHeaderProps) {

  return (
    <div className="headline-control-container">
      <h2>Profile</h2>
      <span style={{ display: isEdited ? "none" : "block" }}><button className="" onClick={editBtnClick}><img src={editPicture} alt="" className="edit-pen-img" /></button></span>
    </div>
  )
}