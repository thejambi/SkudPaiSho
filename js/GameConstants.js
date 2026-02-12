// Game state constants and animation settings.
// These are pure constants with zero dependencies.

export const BRAND_NEW = "Brand New";
export const MOVE_DONE = "Move Done";
export const WAITING_FOR_ENDPOINT = "Waiting for endpoint";
export const READY_FOR_BONUS = "READY_FOR_BONUS";
export const WAITING_FOR_BONUS_ENDPOINT = "WAITING_FOR_BONUS_ENDPOINT";
export const WAITING_FOR_BOAT_BONUS_POINT = "WAITING_FOR_BOAT_BONUS_POINT";

export const HOST_SELECT_ACCENTS = "HOST_SELECT_ACCENTS";

export const replayIntervalLength = 2100;
export const pieceAnimationLength = 1000; // Note that this must be changed in the `.point img` `transition` property as well(main.css)
export const piecePlaceAnimation = 1; // 0 = None, they just appear, 1 =
