export default `
 #define NUM_PATHS 5

vec2 getPathPoint(int index, float t) {

  if (index == 0) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.038) {
      float segT = (localT - 0.000) / 0.038;
      return mix(vec2(-0.990, 0.770), vec2(-0.960, 0.730), segT);
    }
    if (localT >= 0.038 && localT <= 0.077) {
      float segT = (localT - 0.038) / 0.038;
      return mix(vec2(-0.960, 0.730), vec2(-0.937, 0.680), segT);
    }
    if (localT >= 0.077 && localT <= 0.115) {
      float segT = (localT - 0.077) / 0.038;
      return mix(vec2(-0.937, 0.680), vec2(-0.923, 0.633), segT);
    }
    if (localT >= 0.115 && localT <= 0.154) {
      float segT = (localT - 0.115) / 0.038;
      return mix(vec2(-0.923, 0.633), vec2(-0.913, 0.587), segT);
    }
    if (localT >= 0.154 && localT <= 0.192) {
      float segT = (localT - 0.154) / 0.038;
      return mix(vec2(-0.913, 0.587), vec2(-0.897, 0.537), segT);
    }
    if (localT >= 0.192 && localT <= 0.231) {
      float segT = (localT - 0.192) / 0.038;
      return mix(vec2(-0.897, 0.537), vec2(-0.883, 0.487), segT);
    }
    if (localT >= 0.231 && localT <= 0.269) {
      float segT = (localT - 0.231) / 0.038;
      return mix(vec2(-0.883, 0.487), vec2(-0.863, 0.417), segT);
    }
    if (localT >= 0.269 && localT <= 0.308) {
      float segT = (localT - 0.269) / 0.038;
      return mix(vec2(-0.863, 0.417), vec2(-0.843, 0.353), segT);
    }
    if (localT >= 0.308 && localT <= 0.346) {
      float segT = (localT - 0.308) / 0.038;
      return mix(vec2(-0.843, 0.353), vec2(-0.827, 0.290), segT);
    }
    if (localT >= 0.346 && localT <= 0.385) {
      float segT = (localT - 0.346) / 0.038;
      return mix(vec2(-0.827, 0.290), vec2(-0.817, 0.247), segT);
    }
    if (localT >= 0.385 && localT <= 0.423) {
      float segT = (localT - 0.385) / 0.038;
      return mix(vec2(-0.817, 0.247), vec2(-0.803, 0.217), segT);
    }
    if (localT >= 0.423 && localT <= 0.462) {
      float segT = (localT - 0.423) / 0.038;
      return mix(vec2(-0.803, 0.217), vec2(-0.800, 0.203), segT);
    }
    if (localT >= 0.462 && localT <= 0.500) {
      float segT = (localT - 0.462) / 0.038;
      return mix(vec2(-0.800, 0.203), vec2(-0.797, 0.200), segT);
    }
    if (localT >= 0.500 && localT <= 0.538) {
      float segT = (localT - 0.500) / 0.038;
      return mix(vec2(-0.797, 0.200), vec2(-0.793, 0.213), segT);
    }
    if (localT >= 0.538 && localT <= 0.577) {
      float segT = (localT - 0.538) / 0.038;
      return mix(vec2(-0.793, 0.213), vec2(-0.787, 0.257), segT);
    }
    if (localT >= 0.577 && localT <= 0.615) {
      float segT = (localT - 0.577) / 0.038;
      return mix(vec2(-0.787, 0.257), vec2(-0.773, 0.317), segT);
    }
    if (localT >= 0.615 && localT <= 0.654) {
      float segT = (localT - 0.615) / 0.038;
      return mix(vec2(-0.773, 0.317), vec2(-0.750, 0.383), segT);
    }
    if (localT >= 0.654 && localT <= 0.692) {
      float segT = (localT - 0.654) / 0.038;
      return mix(vec2(-0.750, 0.383), vec2(-0.717, 0.447), segT);
    }
    if (localT >= 0.692 && localT <= 0.731) {
      float segT = (localT - 0.692) / 0.038;
      return mix(vec2(-0.717, 0.447), vec2(-0.677, 0.513), segT);
    }
    if (localT >= 0.731 && localT <= 0.769) {
      float segT = (localT - 0.731) / 0.038;
      return mix(vec2(-0.677, 0.513), vec2(-0.637, 0.567), segT);
    }
    if (localT >= 0.769 && localT <= 0.808) {
      float segT = (localT - 0.769) / 0.038;
      return mix(vec2(-0.637, 0.567), vec2(-0.603, 0.607), segT);
    }
    if (localT >= 0.808 && localT <= 0.846) {
      float segT = (localT - 0.808) / 0.038;
      return mix(vec2(-0.603, 0.607), vec2(-0.577, 0.647), segT);
    }
    if (localT >= 0.846 && localT <= 0.885) {
      float segT = (localT - 0.846) / 0.038;
      return mix(vec2(-0.577, 0.647), vec2(-0.550, 0.690), segT);
    }
    if (localT >= 0.885 && localT <= 0.923) {
      float segT = (localT - 0.885) / 0.038;
      return mix(vec2(-0.550, 0.690), vec2(-0.543, 0.703), segT);
    }
    if (localT >= 0.923 && localT <= 0.962) {
      float segT = (localT - 0.923) / 0.038;
      return mix(vec2(-0.543, 0.703), vec2(-0.540, 0.713), segT);
    }
    if (localT >= 0.962 && localT <= 1.000) {
      float segT = (localT - 0.962) / 0.038;
      return mix(vec2(-0.540, 0.713), vec2(-0.537, 0.717), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 1) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.077) {
      float segT = (localT - 0.000) / 0.077;
      return mix(vec2(-0.382, 0.743), vec2(-0.385, 0.733), segT);
    }
    if (localT >= 0.077 && localT <= 0.154) {
      float segT = (localT - 0.077) / 0.077;
      return mix(vec2(-0.385, 0.733), vec2(-0.385, 0.723), segT);
    }
    if (localT >= 0.154 && localT <= 0.231) {
      float segT = (localT - 0.154) / 0.077;
      return mix(vec2(-0.385, 0.723), vec2(-0.385, 0.683), segT);
    }
    if (localT >= 0.231 && localT <= 0.308) {
      float segT = (localT - 0.231) / 0.077;
      return mix(vec2(-0.385, 0.683), vec2(-0.385, 0.637), segT);
    }
    if (localT >= 0.308 && localT <= 0.385) {
      float segT = (localT - 0.308) / 0.077;
      return mix(vec2(-0.385, 0.637), vec2(-0.385, 0.580), segT);
    }
    if (localT >= 0.385 && localT <= 0.462) {
      float segT = (localT - 0.385) / 0.077;
      return mix(vec2(-0.385, 0.580), vec2(-0.378, 0.507), segT);
    }
    if (localT >= 0.462 && localT <= 0.538) {
      float segT = (localT - 0.462) / 0.077;
      return mix(vec2(-0.378, 0.507), vec2(-0.368, 0.437), segT);
    }
    if (localT >= 0.538 && localT <= 0.615) {
      float segT = (localT - 0.538) / 0.077;
      return mix(vec2(-0.368, 0.437), vec2(-0.362, 0.377), segT);
    }
    if (localT >= 0.615 && localT <= 0.692) {
      float segT = (localT - 0.615) / 0.077;
      return mix(vec2(-0.362, 0.377), vec2(-0.355, 0.317), segT);
    }
    if (localT >= 0.692 && localT <= 0.769) {
      float segT = (localT - 0.692) / 0.077;
      return mix(vec2(-0.355, 0.317), vec2(-0.352, 0.257), segT);
    }
    if (localT >= 0.769 && localT <= 0.846) {
      float segT = (localT - 0.769) / 0.077;
      return mix(vec2(-0.352, 0.257), vec2(-0.345, 0.213), segT);
    }
    if (localT >= 0.846 && localT <= 0.923) {
      float segT = (localT - 0.846) / 0.077;
      return mix(vec2(-0.345, 0.213), vec2(-0.342, 0.197), segT);
    }
    if (localT >= 0.923 && localT <= 1.000) {
      float segT = (localT - 0.923) / 0.077;
      return mix(vec2(-0.342, 0.197), vec2(-0.342, 0.193), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 2) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.034) {
      float segT = (localT - 0.000) / 0.034;
      return mix(vec2(-0.068, 0.727), vec2(-0.072, 0.727), segT);
    }
    if (localT >= 0.034 && localT <= 0.069) {
      float segT = (localT - 0.034) / 0.034;
      return mix(vec2(-0.072, 0.727), vec2(-0.072, 0.713), segT);
    }
    if (localT >= 0.069 && localT <= 0.103) {
      float segT = (localT - 0.069) / 0.034;
      return mix(vec2(-0.072, 0.713), vec2(-0.072, 0.690), segT);
    }
    if (localT >= 0.103 && localT <= 0.138) {
      float segT = (localT - 0.103) / 0.034;
      return mix(vec2(-0.072, 0.690), vec2(-0.062, 0.647), segT);
    }
    if (localT >= 0.138 && localT <= 0.172) {
      float segT = (localT - 0.138) / 0.034;
      return mix(vec2(-0.062, 0.647), vec2(-0.052, 0.600), segT);
    }
    if (localT >= 0.172 && localT <= 0.207) {
      float segT = (localT - 0.172) / 0.034;
      return mix(vec2(-0.052, 0.600), vec2(-0.038, 0.540), segT);
    }
    if (localT >= 0.207 && localT <= 0.241) {
      float segT = (localT - 0.207) / 0.034;
      return mix(vec2(-0.038, 0.540), vec2(-0.015, 0.477), segT);
    }
    if (localT >= 0.241 && localT <= 0.276) {
      float segT = (localT - 0.241) / 0.034;
      return mix(vec2(-0.015, 0.477), vec2(0.008, 0.393), segT);
    }
    if (localT >= 0.276 && localT <= 0.310) {
      float segT = (localT - 0.276) / 0.034;
      return mix(vec2(0.008, 0.393), vec2(0.025, 0.337), segT);
    }
    if (localT >= 0.310 && localT <= 0.345) {
      float segT = (localT - 0.310) / 0.034;
      return mix(vec2(0.025, 0.337), vec2(0.045, 0.290), segT);
    }
    if (localT >= 0.345 && localT <= 0.379) {
      float segT = (localT - 0.345) / 0.034;
      return mix(vec2(0.045, 0.290), vec2(0.055, 0.260), segT);
    }
    if (localT >= 0.379 && localT <= 0.414) {
      float segT = (localT - 0.379) / 0.034;
      return mix(vec2(0.055, 0.260), vec2(0.058, 0.250), segT);
    }
    if (localT >= 0.414 && localT <= 0.448) {
      float segT = (localT - 0.414) / 0.034;
      return mix(vec2(0.058, 0.250), vec2(0.062, 0.243), segT);
    }
    if (localT >= 0.448 && localT <= 0.483) {
      float segT = (localT - 0.448) / 0.034;
      return mix(vec2(0.062, 0.243), vec2(0.065, 0.240), segT);
    }
    if (localT >= 0.483 && localT <= 0.517) {
      float segT = (localT - 0.483) / 0.034;
      return mix(vec2(0.065, 0.240), vec2(0.072, 0.243), segT);
    }
    if (localT >= 0.517 && localT <= 0.552) {
      float segT = (localT - 0.517) / 0.034;
      return mix(vec2(0.072, 0.243), vec2(0.088, 0.287), segT);
    }
    if (localT >= 0.552 && localT <= 0.586) {
      float segT = (localT - 0.552) / 0.034;
      return mix(vec2(0.088, 0.287), vec2(0.105, 0.340), segT);
    }
    if (localT >= 0.586 && localT <= 0.621) {
      float segT = (localT - 0.586) / 0.034;
      return mix(vec2(0.105, 0.340), vec2(0.125, 0.407), segT);
    }
    if (localT >= 0.621 && localT <= 0.655) {
      float segT = (localT - 0.621) / 0.034;
      return mix(vec2(0.125, 0.407), vec2(0.142, 0.470), segT);
    }
    if (localT >= 0.655 && localT <= 0.690) {
      float segT = (localT - 0.655) / 0.034;
      return mix(vec2(0.142, 0.470), vec2(0.165, 0.533), segT);
    }
    if (localT >= 0.690 && localT <= 0.724) {
      float segT = (localT - 0.690) / 0.034;
      return mix(vec2(0.165, 0.533), vec2(0.188, 0.587), segT);
    }
    if (localT >= 0.724 && localT <= 0.759) {
      float segT = (localT - 0.724) / 0.034;
      return mix(vec2(0.188, 0.587), vec2(0.208, 0.633), segT);
    }
    if (localT >= 0.759 && localT <= 0.793) {
      float segT = (localT - 0.759) / 0.034;
      return mix(vec2(0.208, 0.633), vec2(0.228, 0.677), segT);
    }
    if (localT >= 0.793 && localT <= 0.828) {
      float segT = (localT - 0.793) / 0.034;
      return mix(vec2(0.228, 0.677), vec2(0.245, 0.717), segT);
    }
    if (localT >= 0.828 && localT <= 0.862) {
      float segT = (localT - 0.828) / 0.034;
      return mix(vec2(0.245, 0.717), vec2(0.255, 0.747), segT);
    }
    if (localT >= 0.862 && localT <= 0.897) {
      float segT = (localT - 0.862) / 0.034;
      return mix(vec2(0.255, 0.747), vec2(0.265, 0.777), segT);
    }
    if (localT >= 0.897 && localT <= 0.931) {
      float segT = (localT - 0.897) / 0.034;
      return mix(vec2(0.265, 0.777), vec2(0.272, 0.790), segT);
    }
    if (localT >= 0.931 && localT <= 0.966) {
      float segT = (localT - 0.931) / 0.034;
      return mix(vec2(0.272, 0.790), vec2(0.278, 0.800), segT);
    }
    if (localT >= 0.966 && localT <= 1.000) {
      float segT = (localT - 0.966) / 0.034;
      return mix(vec2(0.278, 0.800), vec2(0.282, 0.807), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 3) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.034) {
      float segT = (localT - 0.000) / 0.034;
      return mix(vec2(0.255, 0.277), vec2(0.258, 0.283), segT);
    }
    if (localT >= 0.034 && localT <= 0.069) {
      float segT = (localT - 0.034) / 0.034;
      return mix(vec2(0.258, 0.283), vec2(0.262, 0.310), segT);
    }
    if (localT >= 0.069 && localT <= 0.103) {
      float segT = (localT - 0.069) / 0.034;
      return mix(vec2(0.262, 0.310), vec2(0.285, 0.367), segT);
    }
    if (localT >= 0.103 && localT <= 0.138) {
      float segT = (localT - 0.103) / 0.034;
      return mix(vec2(0.285, 0.367), vec2(0.308, 0.423), segT);
    }
    if (localT >= 0.138 && localT <= 0.172) {
      float segT = (localT - 0.138) / 0.034;
      return mix(vec2(0.308, 0.423), vec2(0.342, 0.493), segT);
    }
    if (localT >= 0.172 && localT <= 0.207) {
      float segT = (localT - 0.172) / 0.034;
      return mix(vec2(0.342, 0.493), vec2(0.375, 0.557), segT);
    }
    if (localT >= 0.207 && localT <= 0.241) {
      float segT = (localT - 0.207) / 0.034;
      return mix(vec2(0.375, 0.557), vec2(0.415, 0.620), segT);
    }
    if (localT >= 0.241 && localT <= 0.276) {
      float segT = (localT - 0.241) / 0.034;
      return mix(vec2(0.415, 0.620), vec2(0.452, 0.680), segT);
    }
    if (localT >= 0.276 && localT <= 0.310) {
      float segT = (localT - 0.276) / 0.034;
      return mix(vec2(0.452, 0.680), vec2(0.485, 0.723), segT);
    }
    if (localT >= 0.310 && localT <= 0.345) {
      float segT = (localT - 0.310) / 0.034;
      return mix(vec2(0.485, 0.723), vec2(0.515, 0.757), segT);
    }
    if (localT >= 0.345 && localT <= 0.379) {
      float segT = (localT - 0.345) / 0.034;
      return mix(vec2(0.515, 0.757), vec2(0.538, 0.783), segT);
    }
    if (localT >= 0.379 && localT <= 0.414) {
      float segT = (localT - 0.379) / 0.034;
      return mix(vec2(0.538, 0.783), vec2(0.555, 0.797), segT);
    }
    if (localT >= 0.414 && localT <= 0.448) {
      float segT = (localT - 0.414) / 0.034;
      return mix(vec2(0.555, 0.797), vec2(0.568, 0.807), segT);
    }
    if (localT >= 0.448 && localT <= 0.483) {
      float segT = (localT - 0.448) / 0.034;
      return mix(vec2(0.568, 0.807), vec2(0.572, 0.810), segT);
    }
    if (localT >= 0.483 && localT <= 0.517) {
      float segT = (localT - 0.483) / 0.034;
      return mix(vec2(0.572, 0.810), vec2(0.572, 0.813), segT);
    }
    if (localT >= 0.517 && localT <= 0.552) {
      float segT = (localT - 0.517) / 0.034;
      return mix(vec2(0.572, 0.813), vec2(0.572, 0.793), segT);
    }
    if (localT >= 0.552 && localT <= 0.586) {
      float segT = (localT - 0.552) / 0.034;
      return mix(vec2(0.572, 0.793), vec2(0.572, 0.757), segT);
    }
    if (localT >= 0.586 && localT <= 0.621) {
      float segT = (localT - 0.586) / 0.034;
      return mix(vec2(0.572, 0.757), vec2(0.565, 0.703), segT);
    }
    if (localT >= 0.621 && localT <= 0.655) {
      float segT = (localT - 0.621) / 0.034;
      return mix(vec2(0.565, 0.703), vec2(0.555, 0.643), segT);
    }
    if (localT >= 0.655 && localT <= 0.690) {
      float segT = (localT - 0.655) / 0.034;
      return mix(vec2(0.555, 0.643), vec2(0.548, 0.583), segT);
    }
    if (localT >= 0.690 && localT <= 0.724) {
      float segT = (localT - 0.690) / 0.034;
      return mix(vec2(0.548, 0.583), vec2(0.545, 0.507), segT);
    }
    if (localT >= 0.724 && localT <= 0.759) {
      float segT = (localT - 0.724) / 0.034;
      return mix(vec2(0.545, 0.507), vec2(0.545, 0.467), segT);
    }
    if (localT >= 0.759 && localT <= 0.793) {
      float segT = (localT - 0.759) / 0.034;
      return mix(vec2(0.545, 0.467), vec2(0.545, 0.427), segT);
    }
    if (localT >= 0.793 && localT <= 0.828) {
      float segT = (localT - 0.793) / 0.034;
      return mix(vec2(0.545, 0.427), vec2(0.545, 0.390), segT);
    }
    if (localT >= 0.828 && localT <= 0.862) {
      float segT = (localT - 0.828) / 0.034;
      return mix(vec2(0.545, 0.390), vec2(0.545, 0.370), segT);
    }
    if (localT >= 0.862 && localT <= 0.897) {
      float segT = (localT - 0.862) / 0.034;
      return mix(vec2(0.545, 0.370), vec2(0.545, 0.357), segT);
    }
    if (localT >= 0.897 && localT <= 0.931) {
      float segT = (localT - 0.897) / 0.034;
      return mix(vec2(0.545, 0.357), vec2(0.545, 0.353), segT);
    }
    if (localT >= 0.931 && localT <= 0.966) {
      float segT = (localT - 0.931) / 0.034;
      return mix(vec2(0.545, 0.353), vec2(0.545, 0.350), segT);
    }
    if (localT >= 0.966 && localT <= 1.000) {
      float segT = (localT - 0.966) / 0.034;
      return mix(vec2(0.545, 0.350), vec2(0.545, 0.347), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 4) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.091) {
      float segT = (localT - 0.000) / 0.091;
      return mix(vec2(0.285, 0.503), vec2(0.288, 0.503), segT);
    }
    if (localT >= 0.091 && localT <= 0.182) {
      float segT = (localT - 0.091) / 0.091;
      return mix(vec2(0.288, 0.503), vec2(0.305, 0.507), segT);
    }
    if (localT >= 0.182 && localT <= 0.273) {
      float segT = (localT - 0.182) / 0.091;
      return mix(vec2(0.305, 0.507), vec2(0.348, 0.527), segT);
    }
    if (localT >= 0.273 && localT <= 0.364) {
      float segT = (localT - 0.273) / 0.091;
      return mix(vec2(0.348, 0.527), vec2(0.408, 0.550), segT);
    }
    if (localT >= 0.364 && localT <= 0.455) {
      float segT = (localT - 0.364) / 0.091;
      return mix(vec2(0.408, 0.550), vec2(0.478, 0.580), segT);
    }
    if (localT >= 0.455 && localT <= 0.545) {
      float segT = (localT - 0.455) / 0.091;
      return mix(vec2(0.478, 0.580), vec2(0.542, 0.610), segT);
    }
    if (localT >= 0.545 && localT <= 0.636) {
      float segT = (localT - 0.545) / 0.091;
      return mix(vec2(0.542, 0.610), vec2(0.608, 0.633), segT);
    }
    if (localT >= 0.636 && localT <= 0.727) {
      float segT = (localT - 0.636) / 0.091;
      return mix(vec2(0.608, 0.633), vec2(0.672, 0.650), segT);
    }
    if (localT >= 0.727 && localT <= 0.818) {
      float segT = (localT - 0.727) / 0.091;
      return mix(vec2(0.672, 0.650), vec2(0.732, 0.667), segT);
    }
    if (localT >= 0.818 && localT <= 0.909) {
      float segT = (localT - 0.818) / 0.091;
      return mix(vec2(0.732, 0.667), vec2(0.745, 0.667), segT);
    }
    if (localT >= 0.909 && localT <= 1.000) {
      float segT = (localT - 0.909) / 0.091;
      return mix(vec2(0.745, 0.667), vec2(0.758, 0.670), segT);
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
