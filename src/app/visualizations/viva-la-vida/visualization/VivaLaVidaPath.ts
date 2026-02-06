export default `
#define NUM_PATHS 16

vec2 getPathPoint(float t) {

  if (t >= 0.000000 && t < 0.099120) {
    float localT = (t - 0.000000) / 0.099120;
    if (localT >= 0.000 && localT <= 0.368) {
      float segT = (localT - 0.000) / 0.368;
      return mix(vec2(-0.348, 0.506), vec2(-0.265, 0.232), segT);
    }
    if (localT >= 0.368 && localT <= 0.399) {
      float segT = (localT - 0.368) / 0.031;
      return mix(vec2(-0.265, 0.232), vec2(-0.252, 0.212), segT);
    }
    if (localT >= 0.399 && localT <= 0.411) {
      float segT = (localT - 0.399) / 0.013;
      return mix(vec2(-0.252, 0.212), vec2(-0.252, 0.202), segT);
    }
    if (localT >= 0.411 && localT <= 0.452) {
      float segT = (localT - 0.411) / 0.041;
      return mix(vec2(-0.252, 0.202), vec2(-0.242, 0.172), segT);
    }
    if (localT >= 0.452 && localT <= 0.469) {
      float segT = (localT - 0.452) / 0.017;
      return mix(vec2(-0.242, 0.172), vec2(-0.242, 0.159), segT);
    }
    if (localT >= 0.469 && localT <= 0.920) {
      float segT = (localT - 0.469) / 0.451;
      return mix(vec2(-0.242, 0.159), vec2(-0.252, 0.509), segT);
    }
    if (localT >= 0.920 && localT <= 0.933) {
      float segT = (localT - 0.920) / 0.014;
      return mix(vec2(-0.252, 0.509), vec2(-0.242, 0.512), segT);
    }
    if (localT >= 0.933 && localT <= 0.953) {
      float segT = (localT - 0.933) / 0.019;
      return mix(vec2(-0.242, 0.512), vec2(-0.228, 0.506), segT);
    }
    if (localT >= 0.953 && localT <= 1.000) {
      float segT = (localT - 0.953) / 0.047;
      return mix(vec2(-0.228, 0.506), vec2(-0.192, 0.502), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.099120 && t < 0.144733) {
    float localT = (t - 0.099120) / 0.045614;
    if (localT >= 0.000 && localT <= 0.933) {
      float segT = (localT - 0.000) / 0.933;
      return mix(vec2(-0.129, 0.471), vec2(-0.116, 0.138), segT);
    }
    if (localT >= 0.933 && localT <= 0.966) {
      float segT = (localT - 0.933) / 0.034;
      return mix(vec2(-0.116, 0.138), vec2(-0.123, 0.128), segT);
    }
    if (localT >= 0.966 && localT <= 1.000) {
      float segT = (localT - 0.966) / 0.034;
      return mix(vec2(-0.123, 0.128), vec2(-0.133, 0.121), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.144733 && t < 0.238358) {
    float localT = (t - 0.144733) / 0.093625;
    if (localT >= 0.000 && localT <= 0.023) {
      float segT = (localT - 0.000) / 0.023;
      return mix(vec2(-0.109, 0.491), vec2(-0.106, 0.474), segT);
    }
    if (localT >= 0.023 && localT <= 0.060) {
      float segT = (localT - 0.023) / 0.037;
      return mix(vec2(-0.106, 0.474), vec2(-0.093, 0.451), segT);
    }
    if (localT >= 0.060 && localT <= 0.374) {
      float segT = (localT - 0.060) / 0.315;
      return mix(vec2(-0.093, 0.451), vec2(-0.013, 0.234), segT);
    }
    if (localT >= 0.374 && localT <= 0.468) {
      float segT = (localT - 0.374) / 0.094;
      return mix(vec2(-0.013, 0.234), vec2(0.021, 0.174), segT);
    }
    if (localT >= 0.468 && localT <= 0.501) {
      float segT = (localT - 0.468) / 0.033;
      return mix(vec2(0.021, 0.174), vec2(0.027, 0.151), segT);
    }
    if (localT >= 0.501 && localT <= 0.537) {
      float segT = (localT - 0.501) / 0.036;
      return mix(vec2(0.027, 0.151), vec2(0.027, 0.124), segT);
    }
    if (localT >= 0.537 && localT <= 0.749) {
      float segT = (localT - 0.537) / 0.211;
      return mix(vec2(0.027, 0.124), vec2(0.051, 0.278), segT);
    }
    if (localT >= 0.749 && localT <= 0.775) {
      float segT = (localT - 0.749) / 0.026;
      return mix(vec2(0.051, 0.278), vec2(0.061, 0.294), segT);
    }
    if (localT >= 0.775 && localT <= 0.943) {
      float segT = (localT - 0.775) / 0.167;
      return mix(vec2(0.061, 0.294), vec2(0.087, 0.414), segT);
    }
    if (localT >= 0.943 && localT <= 0.959) {
      float segT = (localT - 0.943) / 0.016;
      return mix(vec2(0.087, 0.414), vec2(0.094, 0.424), segT);
    }
    if (localT >= 0.959 && localT <= 1.000) {
      float segT = (localT - 0.959) / 0.041;
      return mix(vec2(0.094, 0.424), vec2(0.097, 0.454), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.238358 && t < 0.276102) {
    float localT = (t - 0.238358) / 0.037743;
    if (localT >= 0.000 && localT <= 0.406) {
      float segT = (localT - 0.000) / 0.406;
      return mix(vec2(0.041, 0.138), vec2(0.154, 0.178), segT);
    }
    if (localT >= 0.406 && localT <= 0.975) {
      float segT = (localT - 0.406) / 0.569;
      return mix(vec2(0.154, 0.178), vec2(0.321, 0.201), segT);
    }
    if (localT >= 0.975 && localT <= 1.000) {
      float segT = (localT - 0.975) / 0.025;
      return mix(vec2(0.321, 0.201), vec2(0.327, 0.204), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.276102 && t < 0.368698) {
    float localT = (t - 0.276102) / 0.092596;
    if (localT >= 0.000 && localT <= 0.042) {
      float segT = (localT - 0.000) / 0.042;
      return mix(vec2(0.054, 0.054), vec2(0.057, 0.084), segT);
    }
    if (localT >= 0.042 && localT <= 0.062) {
      float segT = (localT - 0.042) / 0.021;
      return mix(vec2(0.057, 0.084), vec2(0.064, 0.098), segT);
    }
    if (localT >= 0.062 && localT <= 0.090) {
      float segT = (localT - 0.062) / 0.028;
      return mix(vec2(0.064, 0.098), vec2(0.067, 0.118), segT);
    }
    if (localT >= 0.090 && localT <= 0.141) {
      float segT = (localT - 0.090) / 0.051;
      return mix(vec2(0.067, 0.118), vec2(0.084, 0.151), segT);
    }
    if (localT >= 0.141 && localT <= 0.453) {
      float segT = (localT - 0.141) / 0.311;
      return mix(vec2(0.084, 0.151), vec2(0.167, 0.361), segT);
    }
    if (localT >= 0.453 && localT <= 0.466) {
      float segT = (localT - 0.453) / 0.014;
      return mix(vec2(0.167, 0.361), vec2(0.167, 0.371), segT);
    }
    if (localT >= 0.466 && localT <= 0.483) {
      float segT = (localT - 0.466) / 0.017;
      return mix(vec2(0.167, 0.371), vec2(0.177, 0.364), segT);
    }
    if (localT >= 0.483 && localT <= 0.560) {
      float segT = (localT - 0.483) / 0.077;
      return mix(vec2(0.177, 0.364), vec2(0.194, 0.311), segT);
    }
    if (localT >= 0.560 && localT <= 0.578) {
      float segT = (localT - 0.560) / 0.018;
      return mix(vec2(0.194, 0.311), vec2(0.194, 0.298), segT);
    }
    if (localT >= 0.578 && localT <= 0.595) {
      float segT = (localT - 0.578) / 0.017;
      return mix(vec2(0.194, 0.298), vec2(0.201, 0.288), segT);
    }
    if (localT >= 0.595 && localT <= 0.757) {
      float segT = (localT - 0.595) / 0.162;
      return mix(vec2(0.201, 0.288), vec2(0.214, 0.171), segT);
    }
    if (localT >= 0.757 && localT <= 0.777) {
      float segT = (localT - 0.757) / 0.021;
      return mix(vec2(0.214, 0.171), vec2(0.221, 0.158), segT);
    }
    if (localT >= 0.777 && localT <= 0.814) {
      float segT = (localT - 0.777) / 0.037;
      return mix(vec2(0.221, 0.158), vec2(0.221, 0.131), segT);
    }
    if (localT >= 0.814 && localT <= 0.843) {
      float segT = (localT - 0.814) / 0.029;
      return mix(vec2(0.221, 0.131), vec2(0.227, 0.111), segT);
    }
    if (localT >= 0.843 && localT <= 1.000) {
      float segT = (localT - 0.843) / 0.157;
      return mix(vec2(0.227, 0.111), vec2(0.241, -0.002), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.368698 && t < 0.417635) {
    float localT = (t - 0.368698) / 0.048937;
    if (localT >= 0.000 && localT <= 1.000) {
      float segT = (localT - 0.000) / 1.000;
      return mix(vec2(-0.406, 0.118), vec2(-0.423, -0.266), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.417635 && t < 0.443607) {
    float localT = (t - 0.417635) / 0.025971;
    if (localT >= 0.000 && localT <= 0.769) {
      float segT = (localT - 0.000) / 0.769;
      return mix(vec2(-0.459, -0.259), vec2(-0.319, -0.189), segT);
    }
    if (localT >= 0.769 && localT <= 0.828) {
      float segT = (localT - 0.769) / 0.059;
      return mix(vec2(-0.319, -0.189), vec2(-0.313, -0.179), segT);
    }
    if (localT >= 0.828 && localT <= 0.895) {
      float segT = (localT - 0.828) / 0.067;
      return mix(vec2(-0.313, -0.179), vec2(-0.299, -0.176), segT);
    }
    if (localT >= 0.895 && localT <= 1.000) {
      float segT = (localT - 0.895) / 0.105;
      return mix(vec2(-0.299, -0.176), vec2(-0.283, -0.162), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.443607 && t < 0.546324) {
    float localT = (t - 0.443607) / 0.102718;
    if (localT >= 0.000 && localT <= 0.083) {
      float segT = (localT - 0.000) / 0.083;
      return mix(vec2(-0.293, -0.356), vec2(-0.293, -0.289), segT);
    }
    if (localT >= 0.083 && localT <= 0.251) {
      float segT = (localT - 0.083) / 0.168;
      return mix(vec2(-0.293, -0.289), vec2(-0.269, -0.156), segT);
    }
    if (localT >= 0.251 && localT <= 0.269) {
      float segT = (localT - 0.251) / 0.019;
      return mix(vec2(-0.269, -0.156), vec2(-0.263, -0.142), segT);
    }
    if (localT >= 0.269 && localT <= 0.299) {
      float segT = (localT - 0.269) / 0.029;
      return mix(vec2(-0.263, -0.142), vec2(-0.246, -0.126), segT);
    }
    if (localT >= 0.299 && localT <= 0.339) {
      float segT = (localT - 0.299) / 0.041;
      return mix(vec2(-0.246, -0.126), vec2(-0.233, -0.096), segT);
    }
    if (localT >= 0.339 && localT <= 0.530) {
      float segT = (localT - 0.339) / 0.190;
      return mix(vec2(-0.233, -0.096), vec2(-0.229, 0.058), segT);
    }
    if (localT >= 0.530 && localT <= 0.589) {
      float segT = (localT - 0.530) / 0.059;
      return mix(vec2(-0.229, 0.058), vec2(-0.209, 0.014), segT);
    }
    if (localT >= 0.589 && localT <= 0.811) {
      float segT = (localT - 0.589) / 0.222;
      return mix(vec2(-0.209, 0.014), vec2(-0.166, -0.159), segT);
    }
    if (localT >= 0.811 && localT <= 0.835) {
      float segT = (localT - 0.811) / 0.024;
      return mix(vec2(-0.166, -0.159), vec2(-0.156, -0.176), segT);
    }
    if (localT >= 0.835 && localT <= 1.000) {
      float segT = (localT - 0.835) / 0.165;
      return mix(vec2(-0.156, -0.176), vec2(-0.116, -0.302), segT);
    }
    if (localT >= 1.000 && localT <= 1.000) {
      float segT = (localT - 1.000) / 0.000;
      return mix(vec2(-0.116, -0.302), vec2(-0.116, -0.302), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.546324 && t < 0.578723) {
    float localT = (t - 0.546324) / 0.032399;
    if (localT >= 0.000 && localT <= 0.052) {
      float segT = (localT - 0.000) / 0.052;
      return mix(vec2(-0.326, -0.276), vec2(-0.313, -0.276), segT);
    }
    if (localT >= 0.052 && localT <= 0.489) {
      float segT = (localT - 0.052) / 0.436;
      return mix(vec2(-0.313, -0.276), vec2(-0.206, -0.246), segT);
    }
    if (localT >= 0.489 && localT <= 0.528) {
      float segT = (localT - 0.489) / 0.039;
      return mix(vec2(-0.206, -0.246), vec2(-0.196, -0.246), segT);
    }
    if (localT >= 0.528 && localT <= 0.570) {
      float segT = (localT - 0.528) / 0.041;
      return mix(vec2(-0.196, -0.246), vec2(-0.186, -0.242), segT);
    }
    if (localT >= 0.570 && localT <= 0.701) {
      float segT = (localT - 0.570) / 0.131;
      return mix(vec2(-0.186, -0.242), vec2(-0.153, -0.242), segT);
    }
    if (localT >= 0.701 && localT <= 0.850) {
      float segT = (localT - 0.701) / 0.150;
      return mix(vec2(-0.153, -0.242), vec2(-0.116, -0.232), segT);
    }
    if (localT >= 0.850 && localT <= 1.000) {
      float segT = (localT - 0.850) / 0.150;
      return mix(vec2(-0.116, -0.232), vec2(-0.086, -0.209), segT);
    }
    if (localT >= 1.000 && localT <= 1.000) {
      float segT = (localT - 1.000) / 0.000;
      return mix(vec2(-0.086, -0.209), vec2(-0.086, -0.209), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.578723 && t < 0.668554) {
    float localT = (t - 0.578723) / 0.089831;
    if (localT >= 0.000 && localT <= 0.355) {
      float segT = (localT - 0.000) / 0.355;
      return mix(vec2(-0.086, -0.109), vec2(-0.073, -0.359), segT);
    }
    if (localT >= 0.355 && localT <= 0.465) {
      float segT = (localT - 0.355) / 0.110;
      return mix(vec2(-0.073, -0.359), vec2(-0.063, -0.436), segT);
    }
    if (localT >= 0.465 && localT <= 0.489) {
      float segT = (localT - 0.465) / 0.024;
      return mix(vec2(-0.063, -0.436), vec2(-0.053, -0.422), segT);
    }
    if (localT >= 0.489 && localT <= 0.651) {
      float segT = (localT - 0.489) / 0.162;
      return mix(vec2(-0.053, -0.422), vec2(-0.023, -0.312), segT);
    }
    if (localT >= 0.651 && localT <= 0.668) {
      float segT = (localT - 0.651) / 0.017;
      return mix(vec2(-0.023, -0.312), vec2(-0.016, -0.302), segT);
    }
    if (localT >= 0.668 && localT <= 0.987) {
      float segT = (localT - 0.668) / 0.319;
      return mix(vec2(-0.016, -0.302), vec2(0.054, -0.089), segT);
    }
    if (localT >= 0.987 && localT <= 1.000) {
      float segT = (localT - 0.987) / 0.013;
      return mix(vec2(0.054, -0.089), vec2(0.061, -0.082), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.668554 && t < 0.698317) {
    float localT = (t - 0.668554) / 0.029763;
    if (localT >= 0.000 && localT <= 1.000) {
      float segT = (localT - 0.000) / 1.000;
      return mix(vec2(0.061, -0.232), vec2(0.057, -0.466), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.698317 && t < 0.736114) {
    float localT = (t - 0.698317) / 0.037797;
    if (localT >= 0.000 && localT <= 0.036) {
      float segT = (localT - 0.000) / 0.036;
      return mix(vec2(0.094, -0.172), vec2(0.097, -0.182), segT);
    }
    if (localT >= 0.036 && localT <= 0.076) {
      float segT = (localT - 0.036) / 0.041;
      return mix(vec2(0.097, -0.182), vec2(0.107, -0.189), segT);
    }
    if (localT >= 0.076 && localT <= 0.126) {
      float segT = (localT - 0.076) / 0.050;
      return mix(vec2(0.107, -0.189), vec2(0.114, -0.202), segT);
    }
    if (localT >= 0.126 && localT <= 0.261) {
      float segT = (localT - 0.126) / 0.135;
      return mix(vec2(0.114, -0.202), vec2(0.114, -0.242), segT);
    }
    if (localT >= 0.261 && localT <= 0.312) {
      float segT = (localT - 0.261) / 0.050;
      return mix(vec2(0.114, -0.242), vec2(0.107, -0.256), segT);
    }
    if (localT >= 0.312 && localT <= 0.646) {
      float segT = (localT - 0.312) / 0.334;
      return mix(vec2(0.107, -0.256), vec2(0.054, -0.172), segT);
    }
    if (localT >= 0.646 && localT <= 0.692) {
      float segT = (localT - 0.646) / 0.046;
      return mix(vec2(0.054, -0.172), vec2(0.067, -0.176), segT);
    }
    if (localT >= 0.692 && localT <= 0.899) {
      float segT = (localT - 0.692) / 0.207;
      return mix(vec2(0.067, -0.176), vec2(0.111, -0.219), segT);
    }
    if (localT >= 0.899 && localT <= 0.934) {
      float segT = (localT - 0.899) / 0.036;
      return mix(vec2(0.111, -0.219), vec2(0.114, -0.229), segT);
    }
    if (localT >= 0.934 && localT <= 0.975) {
      float segT = (localT - 0.934) / 0.041;
      return mix(vec2(0.114, -0.229), vec2(0.124, -0.236), segT);
    }
    if (localT >= 0.975 && localT <= 1.000) {
      float segT = (localT - 0.975) / 0.025;
      return mix(vec2(0.124, -0.236), vec2(0.127, -0.242), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.736114 && t < 0.779487) {
    float localT = (t - 0.736114) / 0.043373;
    if (localT >= 0.000 && localT <= 1.000) {
      float segT = (localT - 0.000) / 1.000;
      return mix(vec2(0.181, -0.122), vec2(0.174, -0.462), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.779487 && t < 0.858632) {
    float localT = (t - 0.779487) / 0.079145;
    if (localT >= 0.000 && localT <= 0.124) {
      float segT = (localT - 0.000) / 0.124;
      return mix(vec2(0.147, -0.459), vec2(0.221, -0.436), segT);
    }
    if (localT >= 0.124 && localT <= 0.158) {
      float segT = (localT - 0.124) / 0.034;
      return mix(vec2(0.221, -0.436), vec2(0.237, -0.422), segT);
    }
    if (localT >= 0.158 && localT <= 0.187) {
      float segT = (localT - 0.158) / 0.029;
      return mix(vec2(0.237, -0.422), vec2(0.254, -0.416), segT);
    }
    if (localT >= 0.187 && localT <= 0.248) {
      float segT = (localT - 0.187) / 0.061;
      return mix(vec2(0.254, -0.416), vec2(0.281, -0.389), segT);
    }
    if (localT >= 0.248 && localT <= 0.264) {
      float segT = (localT - 0.248) / 0.016;
      return mix(vec2(0.281, -0.389), vec2(0.291, -0.389), segT);
    }
    if (localT >= 0.264 && localT <= 0.299) {
      float segT = (localT - 0.264) / 0.034;
      return mix(vec2(0.291, -0.389), vec2(0.307, -0.376), segT);
    }
    if (localT >= 0.299 && localT <= 0.316) {
      float segT = (localT - 0.299) / 0.017;
      return mix(vec2(0.307, -0.376), vec2(0.311, -0.366), segT);
    }
    if (localT >= 0.316 && localT <= 0.346) {
      float segT = (localT - 0.316) / 0.030;
      return mix(vec2(0.311, -0.366), vec2(0.324, -0.352), segT);
    }
    if (localT >= 0.346 && localT <= 0.609) {
      float segT = (localT - 0.346) / 0.263;
      return mix(vec2(0.324, -0.352), vec2(0.331, -0.189), segT);
    }
    if (localT >= 0.609 && localT <= 0.660) {
      float segT = (localT - 0.609) / 0.051;
      return mix(vec2(0.331, -0.189), vec2(0.321, -0.159), segT);
    }
    if (localT >= 0.660 && localT <= 0.699) {
      float segT = (localT - 0.660) / 0.039;
      return mix(vec2(0.321, -0.159), vec2(0.307, -0.139), segT);
    }
    if (localT >= 0.699 && localT <= 0.821) {
      float segT = (localT - 0.699) / 0.122;
      return mix(vec2(0.307, -0.139), vec2(0.251, -0.089), segT);
    }
    if (localT >= 0.821 && localT <= 0.903) {
      float segT = (localT - 0.821) / 0.082;
      return mix(vec2(0.251, -0.089), vec2(0.204, -0.069), segT);
    }
    if (localT >= 0.903 && localT <= 1.000) {
      float segT = (localT - 0.903) / 0.097;
      return mix(vec2(0.204, -0.069), vec2(0.144, -0.062), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.858632 && t < 0.965435) {
    float localT = (t - 0.858632) / 0.106803;
    if (localT >= 0.000 && localT <= 0.434) {
      float segT = (localT - 0.000) / 0.434;
      return mix(vec2(0.284, -0.506), vec2(0.394, -0.159), segT);
    }
    if (localT >= 0.434 && localT <= 0.446) {
      float segT = (localT - 0.434) / 0.012;
      return mix(vec2(0.394, -0.159), vec2(0.394, -0.149), segT);
    }
    if (localT >= 0.446 && localT <= 0.464) {
      float segT = (localT - 0.446) / 0.018;
      return mix(vec2(0.394, -0.149), vec2(0.401, -0.136), segT);
    }
    if (localT >= 0.464 && localT <= 0.500) {
      float segT = (localT - 0.464) / 0.036;
      return mix(vec2(0.401, -0.136), vec2(0.401, -0.106), segT);
    }
    if (localT >= 0.500 && localT <= 0.771) {
      float segT = (localT - 0.500) / 0.271;
      return mix(vec2(0.401, -0.106), vec2(0.414, -0.332), segT);
    }
    if (localT >= 0.771 && localT <= 0.816) {
      float segT = (localT - 0.771) / 0.045;
      return mix(vec2(0.414, -0.332), vec2(0.424, -0.369), segT);
    }
    if (localT >= 0.816 && localT <= 0.913) {
      float segT = (localT - 0.816) / 0.096;
      return mix(vec2(0.424, -0.369), vec2(0.434, -0.449), segT);
    }
    if (localT >= 0.913 && localT <= 1.000) {
      float segT = (localT - 0.913) / 0.087;
      return mix(vec2(0.434, -0.449), vec2(0.464, -0.516), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (t >= 0.965435 && t < 1.000000) {
    float localT = (t - 0.965435) / 0.034565;
    if (localT >= 0.000 && localT <= 1.000) {
      float segT = (localT - 0.000) / 1.000;
      return mix(vec2(0.277, -0.456), vec2(0.547, -0.432), segT);
    }
    if (localT >= 1.000 && localT <= 1.000) {
      float segT = (localT - 1.000) / 0.000;
      return mix(vec2(0.547, -0.432), vec2(0.547, -0.432), segT);
    }
    return vec2(0.0, 0.0);
  }
  return vec2(0.0, 0.0);
}

vec2 drawPath(float t) {
  float normalizedT = fract(t / 7.84057359);
  return getPathPoint(normalizedT);
}
`;
