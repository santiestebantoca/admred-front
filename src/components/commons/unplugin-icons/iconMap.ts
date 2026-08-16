import BiPerson from '~icons/bi/person'
import BiLock from '~icons/bi/lock'
import BiEye from '~icons/bi/eye'
import BiEyeSlash from '~icons/bi/eye-slash'
import BiGear from '~icons/bi/gear'
import BiExclamationTriangleFill from '~icons/bi/exclamation-triangle-fill'
import BiEnvelopePlus from '~icons/bi/envelope-plus'
import BiCollection from '~icons/bi/collection'
import BiSubtract from '~icons/bi/subtract'
import BiPeopleFill from '~icons/bi/people-fill'
import BiPersonWorkspace from '~icons/bi/person-workspace'
import BiCardText from '~icons/bi/card-text'
import BiBoxArrowRight from '~icons/bi/box-arrow-right'
import BiPeople from '~icons/bi/people'
import BiList from '~icons/bi/list'
import BiSend from '~icons/bi/send'
import BiX from '~icons/bi/x'
import BiChevronRight from '~icons/bi/chevron-right'
import BiFloppy from '~icons/bi/floppy'
import BiXLg from '~icons/bi/x-lg'
import BiCheck2 from '~icons/bi/check2'
import BiChevronDown from '~icons/bi/chevron-down'
import BiPersonFill from '~icons/bi/person-fill'
import BiArrowClockwise from '~icons/bi/arrow-clockwise'
import BiChatLeft from '~icons/bi/chat-left'
import BiDash from '~icons/bi/dash'
import BiCopy from '~icons/bi/copy'
import BiThreeDots from '~icons/bi/three-dots'
import BiStopCircle from '~icons/bi/stop-circle'
import BiArrowRight from '~icons/bi/arrow-right'
import BiTrash from '~icons/bi/trash'
import BiPlusLg from '~icons/bi/plus-lg'
import BiPlus from '~icons/bi/plus'
import BiPencil from '~icons/bi/pencil'
import BiCheck2Square from '~icons/bi/check2-square'
import BiExclamationCircle from '~icons/bi/exclamation-circle'
import BiSearch from '~icons/bi/search'
import BiArrowReturnRight from '~icons/bi/arrow-return-right'
import BiArrowReturnLeft from '~icons/bi/arrow-return-left'
import BiArrowLeft from '~icons/bi/arrow-left'
import BiBoxArrowUpRight from '~icons/bi/box-arrow-up-right'
import BiInfoCircle from '~icons/bi/info-circle'
import BiDot from '~icons/bi/dot'
import BiPersonGear from '~icons/bi/person-gear'

export const iconMap = {
    // 'mdi-home': MdiHome,
    'bi-person-gear': BiPersonGear,
    'bi-dot': BiDot,
    'bi-info-circle': BiInfoCircle,
    'bi-box-arrow-up-right': BiBoxArrowUpRight,
    'bi-arrow-left': BiArrowLeft,
    'bi-arrow-return-left': BiArrowReturnLeft,
    'bi-arrow-return-right': BiArrowReturnRight,
    'bi-search': BiSearch,
    'bi-exclamation-circle': BiExclamationCircle,
    'bi-check2-square': BiCheck2Square,
    'bi-pencil': BiPencil,
    'bi-plus': BiPlus,
    'bi-plus-lg': BiPlusLg,
    'bi-trash': BiTrash,
    'bi-arrow-right': BiArrowRight,
    'bi-stop-circle': BiStopCircle,
    'bi-three-dots': BiThreeDots,
    'bi-copy': BiCopy,
    'bi-dash': BiDash,
    'bi-chat-left': BiChatLeft,
    'bi-arrow-clockwise': BiArrowClockwise,
    'bi-person-fill': BiPersonFill,
    'bi-check2': BiCheck2,
    'bi-x-lg': BiXLg,
    'bi-floppy': BiFloppy,
    'bi-person': BiPerson,
    'bi-lock': BiLock,
    'bi-eye': BiEye,
    'bi-eye-slash': BiEyeSlash,
    'bi-gear': BiGear,
    'bi-exclamation-triangle-fill': BiExclamationTriangleFill,
    'bi-envelope-plus': BiEnvelopePlus,
    'bi-collection': BiCollection,
    'bi-subtract': BiSubtract,
    'bi-people-fill': BiPeopleFill,
    'bi-person-workspace': BiPersonWorkspace,
    'bi-card-text': BiCardText,
    'bi-box-arrow-right': BiBoxArrowRight,
    'bi-people': BiPeople,
    'bi-list': BiList,
    'bi-send': BiSend,
    'bi-x': BiX,
    'bi-chevron-right': BiChevronRight,
    'bi-chevron-down': BiChevronDown,
}

export const isValidIcon = (name) => name && Object.prototype.hasOwnProperty.call(iconMap, name)