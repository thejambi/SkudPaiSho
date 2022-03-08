for dir in ../Vagabond/*/; do {
    echo "${dir}";
    newDir="../Fire/${dir#*Vagabond/}";
    echo $newDir;
    cp "${dir}HB.png" "${newDir}HG.png";
    cp "${dir}HS.png" "${newDir}HF.png";
    cp "${dir}HW.png" "${newDir}HY.png";
    cp "${dir}HD.png" "${newDir}HD.png";
    cp "${dir}HT.png" "${newDir}HT.png";
    cp "${dir}GB.png" "${newDir}GG.png";
    cp "${dir}GS.png" "${newDir}GF.png";
    cp "${dir}GW.png" "${newDir}GY.png";
    cp "${dir}GD.png" "${newDir}GD.png";
    cp "${dir}GT.png" "${newDir}GT.png";



} done

