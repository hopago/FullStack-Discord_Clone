import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import CloseIcon from '@mui/icons-material/Close';

const InfoLetter = () => {
  return (
    <div className="infoLetter">
      <div className="text">
        <span>
          성능 개선과 오버레이 등 보다 나은 기능을 사용하고 싶으신가요? 모바일
          앱을 사용하세요!
        </span>
      </div>
      <div className="icon-btn">
        <AppleIcon />
        <AndroidIcon />
        <MobileFriendlyIcon />
        <button>다운로드</button>
      </div>
      <div className="close">
        <CloseIcon />
      </div>
    </div>
  );
}

export default InfoLetter
