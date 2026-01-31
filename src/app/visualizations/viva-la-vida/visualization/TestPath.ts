export default `
  #define NUM_PATHS 1

  vec2 getPathPoint(int index, float t) {

    if (index == 0) {
      float localT = fract(t);
      if (localT >= 0.000 && localT <= 0.037) {
        float segT = (localT - 0.000) / 0.037;
        return mix(vec2(-0.990, 0.773), vec2(-0.990, 0.777), segT);
      }
      if (localT >= 0.037 && localT <= 0.074) {
        float segT = (localT - 0.037) / 0.037;
        return mix(vec2(-0.990, 0.777), vec2(-0.980, 0.770), segT);
      }
      if (localT >= 0.074 && localT <= 0.111) {
        float segT = (localT - 0.074) / 0.037;
        return mix(vec2(-0.980, 0.770), vec2(-0.963, 0.743), segT);
      }
      if (localT >= 0.111 && localT <= 0.148) {
        float segT = (localT - 0.111) / 0.037;
        return mix(vec2(-0.963, 0.743), vec2(-0.937, 0.697), segT);
      }
      if (localT >= 0.148 && localT <= 0.185) {
        float segT = (localT - 0.148) / 0.037;
        return mix(vec2(-0.937, 0.697), vec2(-0.903, 0.630), segT);
      }
      if (localT >= 0.185 && localT <= 0.222) {
        float segT = (localT - 0.185) / 0.037;
        return mix(vec2(-0.903, 0.630), vec2(-0.857, 0.553), segT);
      }
      if (localT >= 0.222 && localT <= 0.259) {
        float segT = (localT - 0.222) / 0.037;
        return mix(vec2(-0.857, 0.553), vec2(-0.780, 0.443), segT);
      }
      if (localT >= 0.259 && localT <= 0.296) {
        float segT = (localT - 0.259) / 0.037;
        return mix(vec2(-0.780, 0.443), vec2(-0.690, 0.317), segT);
      }
      if (localT >= 0.296 && localT <= 0.333) {
        float segT = (localT - 0.296) / 0.037;
        return mix(vec2(-0.690, 0.317), vec2(-0.600, 0.187), segT);
      }
      if (localT >= 0.333 && localT <= 0.370) {
        float segT = (localT - 0.333) / 0.037;
        return mix(vec2(-0.600, 0.187), vec2(-0.530, 0.077), segT);
      }
      if (localT >= 0.370 && localT <= 0.407) {
        float segT = (localT - 0.370) / 0.037;
        return mix(vec2(-0.530, 0.077), vec2(-0.503, 0.037), segT);
      }
      if (localT >= 0.407 && localT <= 0.444) {
        float segT = (localT - 0.407) / 0.037;
        return mix(vec2(-0.503, 0.037), vec2(-0.490, 0.023), segT);
      }
      if (localT >= 0.444 && localT <= 0.481) {
        float segT = (localT - 0.444) / 0.037;
        return mix(vec2(-0.490, 0.023), vec2(-0.490, 0.020), segT);
      }
      if (localT >= 0.481 && localT <= 0.519) {
        float segT = (localT - 0.481) / 0.037;
        return mix(vec2(-0.490, 0.020), vec2(-0.487, 0.020), segT);
      }
      if (localT >= 0.519 && localT <= 0.556) {
        float segT = (localT - 0.519) / 0.037;
        return mix(vec2(-0.487, 0.020), vec2(-0.487, 0.043), segT);
      }
      if (localT >= 0.556 && localT <= 0.593) {
        float segT = (localT - 0.556) / 0.037;
        return mix(vec2(-0.487, 0.043), vec2(-0.477, 0.093), segT);
      }
      if (localT >= 0.593 && localT <= 0.630) {
        float segT = (localT - 0.593) / 0.037;
        return mix(vec2(-0.477, 0.093), vec2(-0.467, 0.157), segT);
      }
      if (localT >= 0.630 && localT <= 0.667) {
        float segT = (localT - 0.630) / 0.037;
        return mix(vec2(-0.467, 0.157), vec2(-0.457, 0.243), segT);
      }
      if (localT >= 0.667 && localT <= 0.704) {
        float segT = (localT - 0.667) / 0.037;
        return mix(vec2(-0.457, 0.243), vec2(-0.430, 0.347), segT);
      }
      if (localT >= 0.704 && localT <= 0.741) {
        float segT = (localT - 0.704) / 0.037;
        return mix(vec2(-0.430, 0.347), vec2(-0.397, 0.467), segT);
      }
      if (localT >= 0.741 && localT <= 0.778) {
        float segT = (localT - 0.741) / 0.037;
        return mix(vec2(-0.397, 0.467), vec2(-0.357, 0.580), segT);
      }
      if (localT >= 0.778 && localT <= 0.815) {
        float segT = (localT - 0.778) / 0.037;
        return mix(vec2(-0.357, 0.580), vec2(-0.300, 0.703), segT);
      }
      if (localT >= 0.815 && localT <= 0.852) {
        float segT = (localT - 0.815) / 0.037;
        return mix(vec2(-0.300, 0.703), vec2(-0.273, 0.753), segT);
      }
      if (localT >= 0.852 && localT <= 0.889) {
        float segT = (localT - 0.852) / 0.037;
        return mix(vec2(-0.273, 0.753), vec2(-0.257, 0.783), segT);
      }
      if (localT >= 0.889 && localT <= 0.926) {
        float segT = (localT - 0.889) / 0.037;
        return mix(vec2(-0.257, 0.783), vec2(-0.247, 0.803), segT);
      }
      if (localT >= 0.926 && localT <= 0.963) {
        float segT = (localT - 0.926) / 0.037;
        return mix(vec2(-0.247, 0.803), vec2(-0.240, 0.810), segT);
      }
      if (localT >= 0.963 && localT <= 1.000) {
        float segT = (localT - 0.963) / 0.037;
        return mix(vec2(-0.240, 0.810), vec2(-0.240, 0.813), segT);
      }
      return vec2(0.0, 0.0);
    }
    return vec2(0.0, 0.0);
  }

  vec2 drawPath(float t) {
    float cycleTime = float(NUM_PATHS);
    float pathIndex = mod(t, cycleTime);
    int index = int(pathIndex);
    
    if (index >= NUM_PATHS) index = NUM_PATHS - 1;
    return getPathPoint(index, t);
  }
`;
