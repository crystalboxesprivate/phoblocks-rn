import React from 'react'
import { Svg, Path, Circle } from 'react-native-svg';

const iconsList = {
  home: () => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" >
      <Path
        d="M17.381 7.875l-1.631-1.63V2.25c0-.619-.506-1.125-1.125-1.125H13.5c-.619 0-1.125.506-1.125 1.125v.622L10.125.624C9.818.334 9.537 0 9 0s-.818.334-1.125.624L.619 7.875C.268 8.241 0 8.507 0 9c0 .633.486 1.125 1.125 1.125H2.25v6.75c0 .619.506 1.125 1.125 1.125H6.75v-5.625c0-.619.506-1.125 1.125-1.125h2.25c.619 0 1.125.506 1.125 1.125V18h3.375c.619 0 1.125-.506 1.125-1.125v-6.75h1.125C17.514 10.125 18 9.633 18 9c0-.493-.268-.76-.619-1.125z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  undo: () => (
    <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
      <Path
        d="M4.342 0L0 4.453l4.342 4.454 1.15-1.174L3.086 5.2h7.846c2.537 0 4.551 2.08 4.551 4.64 0 2.587-2.04 4.64-4.55 4.64H1.804V16h9.127C14.28 16 17 13.227 17 9.813c0-3.413-2.72-6.186-6.068-6.186H3.086l2.406-2.48L4.342 0z"
        fill="#757575"
      />
    </Svg>
  ),
  redo: () => (
    <Svg width={17} height={16} viewBox="0 0 17 16" fill="none" >
      <Path
        d="M12.659 0L17 4.453l-4.341 4.454-1.151-1.174L13.914 5.2H6.068c-2.537 0-4.551 2.08-4.551 4.64 0 2.587 2.04 4.64 4.55 4.64h9.128V16H6.068C2.72 16 0 13.227 0 9.813 0 6.4 2.72 3.627 6.068 3.627h7.846l-2.406-2.48L12.658 0z"
        fill="#757575"
      />
    </Svg>
  ),
  cloud: () => (
    <Svg width={25} height={16} viewBox="0 0 25 16" fill="none">
      <Path
        d="M10.007 2.2c-2.527 0-4.77 1.682-5.578 4.18a.585.585 0 01-.485.406C1.696 7.043 0 9.016 0 11.38 0 13.928 1.986 16 4.429 16H20.57C23.014 16 25 13.928 25 11.379c0-1.711-.904-3.277-2.354-4.086a.617.617 0 01-.307-.594c.017-.18.028-.367.028-.553C22.367 2.76 19.723 0 16.477 0c-1.73 0-3.369.792-4.49 2.177a.57.57 0 01-.58.198 6.26 6.26 0 00-1.4-.175z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  share: () => (
    <Svg width={18} height={25} viewBox="0 0 18 25" fill="none">
      <Path
        d="M12.67 5.962L9 2.292l-3.67 3.67-.968-.97L9 .354l4.639 4.638-.97.97z"
        fill="#B9B9B9"
      />
      <Path d="M8.308 1.323h1.384v14.539H8.308V1.323z" fill="#B9B9B9" />
      <Path
        d="M15.923 24.17H2.077C.9 24.17 0 23.27 0 22.091V9.631c0-1.177.9-2.077 2.077-2.077h4.846v1.384H2.077c-.415 0-.692.277-.692.693v12.461c0 .416.277.693.692.693h13.846c.415 0 .692-.277.692-.693V9.631c0-.416-.276-.693-.692-.693h-4.846V7.554h4.846c1.177 0 2.077.9 2.077 2.077v12.461c0 1.177-.9 2.077-2.077 2.077z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  help: () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle cx={10} cy={10} r={9} stroke="#B9B9B9" />
      <Path
        d="M8.922 12.672c0-.37.01-.68.031-.93.021-.25.068-.471.14-.664.074-.193.183-.372.329-.539.146-.172.346-.367.601-.586l.532-.531a5.58 5.58 0 00.492-.578c.15-.203.273-.412.367-.625.099-.214.149-.435.149-.664 0-.516-.144-.899-.43-1.149-.287-.255-.7-.383-1.242-.383-.209 0-.414.03-.618.086a1.56 1.56 0 00-.53.25 1.328 1.328 0 00-.384.446c-.093.177-.14.39-.14.64H6.344c.005-.484.099-.911.281-1.28.188-.376.44-.688.758-.938.318-.256.69-.446 1.117-.57.427-.131.89-.196 1.39-.196.563 0 1.063.068 1.5.203.438.13.808.323 1.11.578.307.255.54.57.695.946.162.375.242.804.242 1.289 0 .37-.065.716-.195 1.039a3.91 3.91 0 01-.5.898 5.784 5.784 0 01-.687.79c-.255.244-.508.478-.758.702a2.883 2.883 0 00-.36.422 1.534 1.534 0 00-.187.383c-.037.13-.057.27-.063.422-.005.15-.007.33-.007.539H8.922zm-.242 2.39c0-.307.093-.56.28-.757.194-.203.467-.305.821-.305.354 0 .628.102.82.305.198.198.297.45.297.758 0 .296-.098.544-.296.742-.193.192-.467.289-.82.289-.355 0-.628-.097-.821-.29a1.037 1.037 0 01-.281-.742z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  // tools
  selectTool: () => (
    <Svg width={13} height={18} viewBox="0 0 13 18" fill="none">
      <Path d="M0 0v18l5.777-5.148H13L0 0z" fill="#fff" />
    </Svg>
  ),
  transformTool: () => (
    <Svg width={23} height={19} viewBox="0 0 23 19" fill="none">
      <Path
        d="M1.019.346A.934.934 0 00.8.476C.728.539.724.876.724 7.308v6.77l.093.059c.16.1.437.163.593.134.156-.03.295-.143.526-.425l.135-.168v1.283h-.409c-.534.004-.736.084-.854.345-.075.168-.084.286-.084 1.675 0 1.388.009 1.505.084 1.674a.443.443 0 00.261.26c.169.077.287.085 1.675.085 1.388 0 1.506-.008 1.674-.084.261-.118.34-.32.345-.854v-.408h4.712v.408c.005.534.085.736.345.854.169.076.287.084 1.675.084 1.388 0 1.506-.008 1.674-.084.261-.118.341-.32.345-.854v-.408h4.713v.408c.004.534.084.736.345.854.168.076.286.084 1.674.084s1.506-.008 1.675-.084a.443.443 0 00.26-.261c.076-.169.084-.286.084-1.675 0-1.388-.008-1.506-.084-1.674-.117-.26-.32-.34-.85-.345h-.412v-2.02h.413c.53-.004.732-.084.85-.345.075-.168.084-.286.084-1.674 0-1.38-.009-1.506-.08-1.67-.127-.27-.316-.35-.846-.35h-.42V6.883h.412c.53-.004.732-.084.85-.345.075-.168.084-.286.084-1.674s-.009-1.506-.085-1.675a.443.443 0 00-.26-.26c-.169-.076-.287-.085-1.675-.085-1.388 0-1.506.009-1.674.084-.261.118-.341.32-.345.85v.413h-4.713v-.413c-.004-.53-.084-.732-.345-.85-.169-.075-.287-.084-1.675-.084-1.388 0-1.506.009-1.674.084-.261.118-.34.32-.345.85v.413H5.234L3.437 2.285C2.45 1.24 1.59.362 1.527.333a.634.634 0 00-.508.013zm2.078 3.563c.522.572.984 1.11 1.03 1.199.093.177.198.286.413.408.118.067 3.732 3.892 3.702 3.917-.004.004-.774-.055-1.704-.13-1.745-.14-1.91-.14-2.099.008-.055.042-.61.635-1.237 1.317-.627.681-1.157 1.245-1.178 1.254-.021.008-.038-.636-.038-1.561 0-.863-.012-2.945-.025-4.62l-.025-3.046.105.106c.055.058.53.572 1.056 1.148zm9.07.955v.673h-1.346V4.191h1.347v.673zm8.751 0v.673h-1.346V4.191h1.347v.673zM9.475 5.945c.004.535.084.737.345.854.168.076.286.084 1.675.084 1.388 0 1.506-.008 1.674-.084.26-.118.34-.32.345-.854v-.408h4.712v.408c.004.762.177.934.938.938h.408v2.02h-.408c-.534.004-.736.084-.854.345-.076.168-.084.286-.084 1.687 0 1.439.004 1.514.088 1.674.126.253.328.333.85.333h.408v2.02h-.408c-.761.003-.934.176-.938.933v.412h-4.712v-.412c-.004-.53-.084-.732-.345-.85-.169-.075-.287-.084-1.675-.084-1.388 0-1.506.008-1.674.084-.261.118-.34.32-.345.85v.412H4.763v-.412c-.004-.757-.177-.93-.934-.934h-.412v-2.7l.841-.872.842-.87 2.49.21c2.449.206 2.5.206 2.655.135a.663.663 0 00.299-.88c-.047-.084-.985-1.119-2.091-2.3L6.446 5.536h3.029v.408zm11.443 4.977v.674h-1.346v-1.347h1.347v.673zM3.417 16.98v.674H2.07v-1.347h1.346v.674zm8.75 0v.674h-1.346v-1.347h1.347v.674zm8.751 0v.674h-1.346v-1.347h1.347v.674z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  lassoTool: () => (
    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
      <Path
        d="M18 6.02C18 2.694 13.97 0 9 0S0 2.695 0 6.02c0 2.897 3.061 5.315 7.139 5.889.308.187.673.36 1.048.508-.3.304-.587.66-.844 1.075-1.56 2.528-.648 5.033-.609 5.139a.57.57 0 00.718.337.541.541 0 00.327-.704c-.008-.021-.765-2.102.52-4.182.33-.537.721-.95 1.119-1.271.358.087.672.135.891.135.812 0 1.499-.53 1.735-1.263C15.516 10.848 18 8.629 18 6.019zM9.034 11.7c-.389-.164-.73-.387-.73-.608 0-.429 1.29-.684 1.719-.684.313 0 .582.186.704.454a6.405 6.405 0 00-1.693.838zm3.014-1.128a1.824 1.824 0 00-1.739-1.274c-.515 0-1.558.158-2.454.446h-.002l-.206.07c-.24.05-.712.079-1.527-.13l-.003.003a.54.54 0 00-.723.338c-.03.096-.083.238-.107.368-2.544-.814-4.284-2.447-4.284-4.33 0-2.697 3.558-4.882 7.946-4.882s7.946 2.185 7.946 4.881c0 2.054-1.951 3.793-4.847 4.51z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  brushTool: () => (
    <Svg width={25} height={28} viewBox="0 0 25 28" fill="none">
      <Path
        d="M7.08 22.056c-.96 1.296-2.544 1.608-3.696 1.632-1.368.048-2.544-.288-3.12-.528 1.488-.624 2.04-1.536 2.616-2.496.312-.528.624-1.056 1.128-1.584a2.032 2.032 0 011.488-.648 2.061 2.061 0 011.512.576c.96.888.696 2.208.072 3.048zM17.256 1.776l-9.264 17.16c-.12-.168-.24-.336-.408-.48a2.804 2.804 0 00-2.04-.792L15.96 1.032a.729.729 0 01.984-.264l.072.048a.721.721 0 01.24.96z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  eraserTool: () => (
    <Svg width={24} height={18} viewBox="0 0 24 18" fill="none">
      <Path
        d="M23.879.226A.576.576 0 0023.421 0h-11.48a.57.57 0 00-.29.081l-.019-.017-9.68 10.251-.103.116.012.014a.498.498 0 00-.05.118L.02 17.273A.576.576 0 00.577 18h11.484c.183.001.347-.077.516-.247L22.02 7.73c.03-.03.135-.18.167-.292L23.918.962l.064-.236a.582.582 0 00-.103-.5zM13.104 11.289l-1.487 5.558H1.327l1.486-5.558h10.29zm9.07-10.136l-8.478 8.98H3.71l8.478-8.98h9.986z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  paintBucketTool: () => (
    <Svg width={22} height={19} viewBox="0 0 22 19" fill="none">
      <Path
        d="M9.268.05c-.05.027-.17.12-.269.213l-.18.164-.829.049C6.645.56 5.663.723 4.726 1.02c-1.56.505-2.506 1.28-2.82 2.315-.094.3-.09.947.01 1.31.116.443.394.934.734 1.284l.296.31-1.044 1.03C1.323 7.833.763 8.422.655 8.572c-.69.939-.842 2.143-.421 3.258.224.589.426.82 3.067 3.435 1.38 1.372 2.694 2.652 2.918 2.842.727.633 1.43.898 2.354.894.762-.005 1.255-.15 1.928-.58.148-.097 1.672-1.562 3.878-3.736 2-1.965 3.659-3.576 3.685-3.576.081 0 .355.35.498.641.359.717.52 1.598.57 3.121.049 1.483.21 2.151.64 2.62.306.332.669.425 1.027.253.597-.284.955-1.191 1.144-2.851.076-.695.076-2.545 0-3.01-.193-1.164-.628-2.258-1.229-3.107-1.112-1.563-2.968-2.767-5.214-3.377l-.493-.133-2.623-2.585C10.94 1.259 9.716.073 9.663.046a.428.428 0 00-.395.004zm4.855 13.607c-3.716 3.661-4.075 3.997-4.362 4.143-.408.209-.784.301-1.21.301-.623 0-1.121-.181-1.637-.601-.161-.129-1.443-1.377-2.851-2.771-1.758-1.736-2.623-2.625-2.744-2.816-.489-.752-.538-1.642-.135-2.474.126-.266.287-.443 1.337-1.487L3.713 6.76l.448.208c1.327.615 3.184 1.01 5.295 1.124l.726.04.126.142c.408.482 1.22.376 1.529-.2.148-.287.045-.832-.198-1.044a.944.944 0 00-1.277.031l-.17.164-.552-.031c-1.614-.089-3.143-.35-4.25-.726-.44-.146-.942-.363-.942-.403 0-.062 4.784-4.736 4.873-4.758a.45.45 0 00.153-.098c.05-.057.672.54 4.376 4.197l4.318 4.262-4.045 3.988zM5.73 3.49L3.628 5.566l-.135-.093c-.197-.146-.506-.575-.618-.863-.077-.186-.104-.35-.104-.629-.004-.34.01-.407.144-.673.417-.84 1.852-1.527 3.73-1.779.283-.04.565-.075.628-.088a4.35 4.35 0 01.336-.023l.224-.004L5.73 3.49zm11.38 3.475c2.474 1.239 3.815 3.133 3.963 5.612.04.682-.01 2-.099 2.66-.112.77-.385 1.625-.524 1.625-.068 0-.216-.358-.292-.7-.031-.163-.08-.765-.107-1.336-.072-1.78-.247-2.67-.7-3.541a3.53 3.53 0 00-.417-.624l-.224-.248.202-.195c.25-.24.332-.385.332-.598 0-.159-.063-.23-1.4-1.553-.77-.762-1.376-1.386-1.349-1.386.027 0 .305.129.614.284z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  patchTool: () => (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M6.36 20.149l-.001-.001-4.508-4.508 2.614-2.614-1.061-1.061L.79 14.579a1.496 1.496 0 00-.439 1.061c0 .415.168.789.439 1.061l4.508 4.508a1.499 1.499 0 002.122 0l2.614-2.614-1.06-1.06-2.614 2.614zM15.64 1.852l4.508 4.508-2.614 2.614 1.061 1.061 2.614-2.614c.271-.271.439-.646.439-1.061 0-.415-.168-.789-.439-1.061L16.701.791a1.499 1.499 0 00-2.122 0l-2.614 2.614 1.061 1.061 2.614-2.614zM10.295 8.727L11.022 8l.727.727-.727.727-.727-.727zM10.295 13.273l.727-.727.727.727-.727.727-.727-.727zM12.568 11l.727-.727.727.727-.727.727-.727-.727zM8.023 11l.727-.727.727.727-.727.727L8.023 11z"
        fill="#B9B9B9"
      />
      <Path
        d="M20.315 13.685L7.951 1.321A2.244 2.244 0 006.36.662c-.621 0-1.184.252-1.591.659L1.322 4.768c-.407.407-.659.97-.659 1.591s.252 1.184.659 1.591L14.05 20.678l.011.011a2.24 2.24 0 001.58.648c.621 0 1.184-.252 1.591-.659l3.447-3.447c.407-.407.659-.97.659-1.591s-.252-1.184-.659-1.591l-.364-.364zM2.382 6.89a.747.747 0 010-1.06l3.447-3.447a.747.747 0 011.06 0l3.049 3.049L5.43 9.94 2.382 6.89zM6.492 11L11 6.492 15.508 11 11 15.508 6.492 11zm13.126 5.171l-3.447 3.447a.747.747 0 01-1.06 0l-3.049-3.049 4.508-4.508 3.049 3.049a.747.747 0 010 1.06l-.001.001z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  cropTool: () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M14.546 12.727h1.818V5.455c0-1-.819-1.819-1.819-1.819H7.274v1.819h7.273v7.272zm-9.091 1.819V0H3.636v3.636H0v1.819h3.636v9.09c0 1 .819 1.819 1.819 1.819h9.09V20h1.819v-3.636H20v-1.819H5.455z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  textTool: () => (
    <Svg width={15} height={18} viewBox="0 0 15 18" fill="none">
      <Path
        d="M14.613.938V4.71h-1.968l-.176-1.957H8.684v13.441l1.91.328V18h-6.13v-1.477l1.911-.328V2.754H2.578L2.414 4.71H.434V.937h14.18z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  pictureTool: () => (
    <Svg width={18} height={16} viewBox="0 0 18 16" fill="none">
      <Path
        d="M13.5 6.429a1.93 1.93 0 10-.001-3.859A1.93 1.93 0 0013.5 6.43z"
        fill="#B9B9B9"
      />
      <Path
        d="M16.875 0H1.125C.498 0 0 .51 0 1.137v13.154c0 .627.498 1.138 1.125 1.138h15.75c.627 0 1.125-.51 1.125-1.138V1.137C18 .51 17.502 0 16.875 0zm-4.142 7.943a.69.69 0 00-.515-.249c-.205 0-.35.097-.514.23l-.751.634c-.157.113-.282.189-.462.189a.665.665 0 01-.442-.165 5.223 5.223 0 01-.173-.165L7.714 6.08a.886.886 0 00-.67-.301.913.913 0 00-.676.313l-5.082 6.131V1.756a.53.53 0 01.526-.47h14.372a.51.51 0 01.518.482l.012 10.462-3.981-4.287z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  eyeDropper: () => (
    <Svg width={23} height={28} viewBox="0 0 23 28" fill="none">
      <Path
        d="M1.629 23.848c1.021.972 3.236.313 5.046-1.504l8.532-8.561.655.627a1.286 1.286 0 001.79-.016 1.219 1.219 0 00-.03-1.751l-.96-.916 4.572-4.589c.81-.813.788-2.12-.049-2.918-.838-.8-2.173-.788-2.982.024l-4.573 4.59-.96-.917a1.288 1.288 0 00-1.791.015 1.22 1.22 0 00.031 1.753l.656.625-8.53 8.562c-1.81 1.817-2.429 4.001-1.407 4.976zm10.543-12.959l2.428 2.315-8.531 8.562c-1.555 1.56-3.278 2.04-3.853 1.492-.574-.548-.13-2.246 1.426-3.808l8.53-8.561z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  // right sidebar
  layers: () => (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none">
      <Path
        d="M18.643 5.193L9.5 0 .357 5.193 9.5 10.416l9.143-5.223z"
        fill="#B9B9B9"
      />
      <Path
        d="M9.5 11.316L3.335 7.793.357 9.484 9.5 14.708l9.143-5.224-2.978-1.69L9.5 11.315z"
        fill="#B9B9B9"
      />
      <Path
        d="M9.5 15.607l-6.165-3.522-2.978 1.691L9.5 19l9.143-5.224-2.978-1.691L9.5 15.607z"
        fill="#B9B9B9"
      />
    </Svg>
  ),

  layersParameters: () => (
    <Svg width={21} height={19} viewBox="0 0 21 19" fill="none">
      <Path
        d="M18.643 5.193L9.5 0 .357 5.193 9.5 10.416l.5-.285V6h7.23l1.413-.807zM10 15.32v3.393L9.5 19 .357 13.776l2.978-1.691L9.5 15.607l.5-.285zm0-4.291v3.393l-.5.285L.357 9.484l2.978-1.69L9.5 11.314l.5-.285z"
        fill="#B9B9B9"
      />
      <Path
        d="M12 8h9v2h-9V8zM12 16h9v2h-9v-2zM12 12h9v2h-9v-2z"
        fill="#C4C4C4"
      />
    </Svg>
  ),
  parameters: () => (
    <Svg width={18} height={19} viewBox="0 0 18 19" fill="none">
      <Path
        d="M6.868 8.891H.592C.237 8.891 0 9.135 0 9.5s.237.609.592.609h6.276c.237.974 1.066 1.705 2.132 1.705s1.895-.73 2.132-1.705h6.276c.355 0 .592-.244.592-.609s-.237-.609-.592-.609h-6.276C10.895 7.917 10.066 7.186 9 7.186s-1.895.73-2.132 1.705zm3.08 0c.118.244.118.365.118.609s-.119.365-.119.609c-.118.365-.592.609-.947.609-.474 0-.829-.244-.947-.609-.119-.244-.237-.365-.237-.609s.118-.365.118-.609c.237-.365.592-.609 1.066-.609.355 0 .829.244.947.609zm.71 7.186H.592c-.355 0-.592.243-.592.609 0 .365.237.609.592.609h10.066c.237.974 1.066 1.705 2.132 1.705 1.065 0 1.894-.73 2.131-1.705h2.487c.355 0 .592-.244.592-.61 0-.364-.237-.608-.592-.608H14.92c-.237-.974-1.066-1.705-2.131-1.705-1.066 0-1.895.73-2.132 1.705zm3.079 0c.118.122.118.365.118.609s-.118.365-.118.609c-.237.365-.592.609-.947.609-.474 0-.83-.244-.948-.61-.118-.12-.118-.364-.118-.608s.118-.366.118-.61c.237-.365.592-.608.947-.608.356 0 .711.243.948.609zM3.079 1.705H.592c-.355 0-.592.244-.592.61 0 .364.237.608.592.608H3.08c.237.974 1.066 1.705 2.132 1.705 1.065 0 1.894-.73 2.131-1.705h10.066c.355 0 .592-.244.592-.609s-.237-.609-.592-.609H7.342C7.105.731 6.276 0 5.211 0 4.145 0 3.316.73 3.079 1.705zm3.079 0c.118.122.118.366.118.61 0 .243-.118.364-.118.608-.237.365-.592.609-.947.609-.474 0-.83-.244-.948-.609-.118-.122-.118-.365-.118-.609 0-.243.118-.365.118-.609.237-.365.592-.609.948-.609.473 0 .828.244.947.61z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  addLayer: () => (
    <Svg width={18} height={17} viewBox="0 0 18 17" fill="none">
      <Path stroke="#B9B9B9" d="M1 1h16v15H1z" />
      <Path
        d="M9.548 7.924h3.71v1.652h-3.71v4.258H7.72V9.576H4V7.924h3.72V4h1.828v3.924z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  eyeCrossed: (scale) => (
    <Svg width={20 * (scale || 1)} height={16 * (scale || 1)} viewBox="0 0 20 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6 16L1.6 1l.707-.707 15 15L16.6 16z"
        fill="#B9B9B9"
      />
      <Path
        d="M15.73 12.316C18.52 10.236 20 7.292 20 7.292S16.424 1 10.012 1c-1.689 0-3.191.451-4.486 1.112l2.12 2.119C8.315 3.77 9.125 3.5 10 3.5a4.171 4.171 0 014.167 4.167c0 .873-.27 1.684-.731 2.354l2.294 2.295zM6.893 4.893a4.15 4.15 0 00-1.06 2.774A4.171 4.171 0 0010 11.833a4.15 4.15 0 002.774-1.06l2.115 2.116c-1.369.847-3 1.444-4.877 1.444C4.03 14.333 0 7.293 0 7.293s1.65-2.804 4.624-4.669l2.27 2.27z"
        fill="#B9B9B9"
      />
      <Path
        d="M10.037 5.167H10a2.503 2.503 0 00-2.5 2.5c0 1.378 1.122 2.5 2.5 2.5a2.503 2.503 0 002.327-3.415 1.5 1.5 0 01-2.29-1.585z"
        fill="#B9B9B9"
      />
    </Svg>
  ),
  eye: (fill, scale) => (
    <Svg width={20 * (scale || 1)} height={14 * (scale || 1)} viewBox="0 0 20 14" fill="none">
      <Path
        d="M12.5 7c0 1.378-1.122 2.5-2.5 2.5A2.503 2.503 0 017.5 7c0-1.378 1.122-2.5 2.5-2.5s2.5 1.122 2.5 2.5zm7.5-.374s-3.543 7.04-9.988 7.04C4.03 13.667 0 6.627 0 6.627S3.705.333 10.012.333C16.424.333 20 6.626 20 6.626zM14.167 7A4.171 4.171 0 0010 2.833 4.171 4.171 0 005.833 7 4.171 4.171 0 0010 11.167 4.171 4.171 0 0014.167 7z"
        fill={fill || "#B9B9B9"}
      />
    </Svg>
  ),
  mask: () => (
    <Svg width={20} height={17} viewBox="0 0 20 17" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 0H0v17h20V0zM10 14a5 5 0 100-10 5 5 0 000 10z"
        fill="#C4C4C4"
      />
    </Svg>
  ),
  mergeDown: () => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path d="M2 0H0v6h2V2h14v14h-6v2h8V0H2z" fill="#C4C4C4" />
      <Path d="M10 6.5H5v8" stroke="#C4C4C4" />
      <Path d="M9.5 12.5h-9l4.5 5 4.5-5z" fill="#C4C4C4" />
    </Svg>
  ),
  energy: () => (
    <Svg width={26} height={23} viewBox="0 0 26 23" fill="none">
      <Path
        d="M22.01 11.56a.449.449 0 00.198-.412c-.01-.169-.124-.294-.274-.374l-3.291-1.76 3.947-5.677a.509.509 0 00-.052-.64.49.49 0 00-.628-.055l-9.153 6.41a.517.517 0 00-.212.443c.011.168.096.344.246.424l3.248 1.738-3.783 5.47c-.133.193-.096.433.073.6.035.034.075.06.116.081.16.086.357.08.51-.026l9.055-6.223z"
        fill="#C4C4C4"
      />
      <Path
        d="M20.155 14.276a.752.752 0 00.071 1.224L15 18.767V19h-.374L12 20.642 3.774 15.5l7.756-4.848a1 1 0 10-1.06-1.696l-9.113 5.696a1 1 0 000 1.696l10.113 6.32a1 1 0 001.06 0l10.113-6.32a1 1 0 000-1.696l-1.06-.662a1 1 0 00-1.154.067l-.274.219z"
        fill="#C4C4C4"
      />
    </Svg>
  ),
  dots: () => (
    <Svg width={16} height={4} viewBox="0 0 16 4" fill="none">
      <Path
        d="M4 2a2 2 0 11-4 0 2 2 0 014 0zM10 2a2 2 0 11-4 0 2 2 0 014 0zM16 2a2 2 0 11-4 0 2 2 0 014 0z"
        fill="#C4C4C4"
      />
    </Svg>
  ),
  clippingMask: () => (
    <Svg width={7} height={8} viewBox="0 0 7 8" fill="none">
      <Path fill="#B9B9B9" d="M2 0h5v1H2zM2 1h1v4H2zM5.5 5H0l2.5 3 3-3z" />
    </Svg>
  ),
  groupTriangle: () => (
    <Svg width={8} height={6} viewBox="0 0 8 6" fill="none">
      <Path d="M8 0H0l4 6 4-6z" fill="#B9B9B9" />
    </Svg>
  )
}

const Icon = ({ name, fill }) => {
  const iconFunction = iconsList[name]
  if (iconFunction != null) {
    return iconFunction(fill)
  }
  return null
}

export default Icon