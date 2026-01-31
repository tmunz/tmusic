export default `
  #define NUM_PATHS 10

vec2 getPathPoint(int index, float t) {

  if (index == 0) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.011) {
      float segT = (localT - 0.000) / 0.011;
      return mix(vec2(-0.343, 0.517), vec2(-0.343, 0.513), segT);
    }
    if (localT >= 0.011 && localT <= 0.022) {
      float segT = (localT - 0.011) / 0.011;
      return mix(vec2(-0.343, 0.513), vec2(-0.343, 0.507), segT);
    }
    if (localT >= 0.022 && localT <= 0.034) {
      float segT = (localT - 0.022) / 0.011;
      return mix(vec2(-0.343, 0.507), vec2(-0.343, 0.503), segT);
    }
    if (localT >= 0.034 && localT <= 0.045) {
      float segT = (localT - 0.034) / 0.011;
      return mix(vec2(-0.343, 0.503), vec2(-0.343, 0.497), segT);
    }
    if (localT >= 0.045 && localT <= 0.056) {
      float segT = (localT - 0.045) / 0.011;
      return mix(vec2(-0.343, 0.497), vec2(-0.343, 0.467), segT);
    }
    if (localT >= 0.056 && localT <= 0.067) {
      float segT = (localT - 0.056) / 0.011;
      return mix(vec2(-0.343, 0.467), vec2(-0.340, 0.460), segT);
    }
    if (localT >= 0.067 && localT <= 0.079) {
      float segT = (localT - 0.067) / 0.011;
      return mix(vec2(-0.340, 0.460), vec2(-0.340, 0.450), segT);
    }
    if (localT >= 0.079 && localT <= 0.090) {
      float segT = (localT - 0.079) / 0.011;
      return mix(vec2(-0.340, 0.450), vec2(-0.330, 0.413), segT);
    }
    if (localT >= 0.090 && localT <= 0.101) {
      float segT = (localT - 0.090) / 0.011;
      return mix(vec2(-0.330, 0.413), vec2(-0.327, 0.403), segT);
    }
    if (localT >= 0.101 && localT <= 0.112) {
      float segT = (localT - 0.101) / 0.011;
      return mix(vec2(-0.327, 0.403), vec2(-0.323, 0.390), segT);
    }
    if (localT >= 0.112 && localT <= 0.124) {
      float segT = (localT - 0.112) / 0.011;
      return mix(vec2(-0.323, 0.390), vec2(-0.310, 0.347), segT);
    }
    if (localT >= 0.124 && localT <= 0.135) {
      float segT = (localT - 0.124) / 0.011;
      return mix(vec2(-0.310, 0.347), vec2(-0.303, 0.333), segT);
    }
    if (localT >= 0.135 && localT <= 0.146) {
      float segT = (localT - 0.135) / 0.011;
      return mix(vec2(-0.303, 0.333), vec2(-0.300, 0.330), segT);
    }
    if (localT >= 0.146 && localT <= 0.157) {
      float segT = (localT - 0.146) / 0.011;
      return mix(vec2(-0.300, 0.330), vec2(-0.287, 0.293), segT);
    }
    if (localT >= 0.157 && localT <= 0.169) {
      float segT = (localT - 0.157) / 0.011;
      return mix(vec2(-0.287, 0.293), vec2(-0.283, 0.287), segT);
    }
    if (localT >= 0.169 && localT <= 0.180) {
      float segT = (localT - 0.169) / 0.011;
      return mix(vec2(-0.283, 0.287), vec2(-0.277, 0.277), segT);
    }
    if (localT >= 0.180 && localT <= 0.191) {
      float segT = (localT - 0.180) / 0.011;
      return mix(vec2(-0.277, 0.277), vec2(-0.267, 0.257), segT);
    }
    if (localT >= 0.191 && localT <= 0.202) {
      float segT = (localT - 0.191) / 0.011;
      return mix(vec2(-0.267, 0.257), vec2(-0.263, 0.250), segT);
    }
    if (localT >= 0.202 && localT <= 0.213) {
      float segT = (localT - 0.202) / 0.011;
      return mix(vec2(-0.263, 0.250), vec2(-0.263, 0.247), segT);
    }
    if (localT >= 0.213 && localT <= 0.225) {
      float segT = (localT - 0.213) / 0.011;
      return mix(vec2(-0.263, 0.247), vec2(-0.253, 0.220), segT);
    }
    if (localT >= 0.225 && localT <= 0.236) {
      float segT = (localT - 0.225) / 0.011;
      return mix(vec2(-0.253, 0.220), vec2(-0.250, 0.213), segT);
    }
    if (localT >= 0.236 && localT <= 0.247) {
      float segT = (localT - 0.236) / 0.011;
      return mix(vec2(-0.250, 0.213), vec2(-0.247, 0.200), segT);
    }
    if (localT >= 0.247 && localT <= 0.258) {
      float segT = (localT - 0.247) / 0.011;
      return mix(vec2(-0.247, 0.200), vec2(-0.247, 0.197), segT);
    }
    if (localT >= 0.258 && localT <= 0.270) {
      float segT = (localT - 0.258) / 0.011;
      return mix(vec2(-0.247, 0.197), vec2(-0.247, 0.193), segT);
    }
    if (localT >= 0.270 && localT <= 0.281) {
      float segT = (localT - 0.270) / 0.011;
      return mix(vec2(-0.247, 0.193), vec2(-0.247, 0.190), segT);
    }
    if (localT >= 0.281 && localT <= 0.292) {
      float segT = (localT - 0.281) / 0.011;
      return mix(vec2(-0.247, 0.190), vec2(-0.247, 0.187), segT);
    }
    if (localT >= 0.292 && localT <= 0.303) {
      float segT = (localT - 0.292) / 0.011;
      return mix(vec2(-0.247, 0.187), vec2(-0.247, 0.183), segT);
    }
    if (localT >= 0.303 && localT <= 0.315) {
      float segT = (localT - 0.303) / 0.011;
      return mix(vec2(-0.247, 0.183), vec2(-0.247, 0.180), segT);
    }
    if (localT >= 0.315 && localT <= 0.326) {
      float segT = (localT - 0.315) / 0.011;
      return mix(vec2(-0.247, 0.180), vec2(-0.250, 0.180), segT);
    }
    if (localT >= 0.326 && localT <= 0.337) {
      float segT = (localT - 0.326) / 0.011;
      return mix(vec2(-0.250, 0.180), vec2(-0.253, 0.180), segT);
    }
    if (localT >= 0.337 && localT <= 0.348) {
      float segT = (localT - 0.337) / 0.011;
      return mix(vec2(-0.253, 0.180), vec2(-0.253, 0.183), segT);
    }
    if (localT >= 0.348 && localT <= 0.360) {
      float segT = (localT - 0.348) / 0.011;
      return mix(vec2(-0.253, 0.183), vec2(-0.253, 0.190), segT);
    }
    if (localT >= 0.360 && localT <= 0.371) {
      float segT = (localT - 0.360) / 0.011;
      return mix(vec2(-0.253, 0.190), vec2(-0.253, 0.200), segT);
    }
    if (localT >= 0.371 && localT <= 0.382) {
      float segT = (localT - 0.371) / 0.011;
      return mix(vec2(-0.253, 0.200), vec2(-0.250, 0.207), segT);
    }
    if (localT >= 0.382 && localT <= 0.393) {
      float segT = (localT - 0.382) / 0.011;
      return mix(vec2(-0.250, 0.207), vec2(-0.250, 0.217), segT);
    }
    if (localT >= 0.393 && localT <= 0.404) {
      float segT = (localT - 0.393) / 0.011;
      return mix(vec2(-0.250, 0.217), vec2(-0.250, 0.227), segT);
    }
    if (localT >= 0.404 && localT <= 0.416) {
      float segT = (localT - 0.404) / 0.011;
      return mix(vec2(-0.250, 0.227), vec2(-0.247, 0.240), segT);
    }
    if (localT >= 0.416 && localT <= 0.427) {
      float segT = (localT - 0.416) / 0.011;
      return mix(vec2(-0.247, 0.240), vec2(-0.247, 0.247), segT);
    }
    if (localT >= 0.427 && localT <= 0.438) {
      float segT = (localT - 0.427) / 0.011;
      return mix(vec2(-0.247, 0.247), vec2(-0.247, 0.253), segT);
    }
    if (localT >= 0.438 && localT <= 0.449) {
      float segT = (localT - 0.438) / 0.011;
      return mix(vec2(-0.247, 0.253), vec2(-0.247, 0.267), segT);
    }
    if (localT >= 0.449 && localT <= 0.461) {
      float segT = (localT - 0.449) / 0.011;
      return mix(vec2(-0.247, 0.267), vec2(-0.247, 0.270), segT);
    }
    if (localT >= 0.461 && localT <= 0.472) {
      float segT = (localT - 0.461) / 0.011;
      return mix(vec2(-0.247, 0.270), vec2(-0.247, 0.273), segT);
    }
    if (localT >= 0.472 && localT <= 0.483) {
      float segT = (localT - 0.472) / 0.011;
      return mix(vec2(-0.247, 0.273), vec2(-0.247, 0.283), segT);
    }
    if (localT >= 0.483 && localT <= 0.494) {
      float segT = (localT - 0.483) / 0.011;
      return mix(vec2(-0.247, 0.283), vec2(-0.247, 0.290), segT);
    }
    if (localT >= 0.494 && localT <= 0.506) {
      float segT = (localT - 0.494) / 0.011;
      return mix(vec2(-0.247, 0.290), vec2(-0.247, 0.297), segT);
    }
    if (localT >= 0.506 && localT <= 0.517) {
      float segT = (localT - 0.506) / 0.011;
      return mix(vec2(-0.247, 0.297), vec2(-0.247, 0.303), segT);
    }
    if (localT >= 0.517 && localT <= 0.528) {
      float segT = (localT - 0.517) / 0.011;
      return mix(vec2(-0.247, 0.303), vec2(-0.247, 0.310), segT);
    }
    if (localT >= 0.528 && localT <= 0.539) {
      float segT = (localT - 0.528) / 0.011;
      return mix(vec2(-0.247, 0.310), vec2(-0.247, 0.320), segT);
    }
    if (localT >= 0.539 && localT <= 0.551) {
      float segT = (localT - 0.539) / 0.011;
      return mix(vec2(-0.247, 0.320), vec2(-0.247, 0.330), segT);
    }
    if (localT >= 0.551 && localT <= 0.562) {
      float segT = (localT - 0.551) / 0.011;
      return mix(vec2(-0.247, 0.330), vec2(-0.247, 0.340), segT);
    }
    if (localT >= 0.562 && localT <= 0.573) {
      float segT = (localT - 0.562) / 0.011;
      return mix(vec2(-0.247, 0.340), vec2(-0.247, 0.347), segT);
    }
    if (localT >= 0.573 && localT <= 0.584) {
      float segT = (localT - 0.573) / 0.011;
      return mix(vec2(-0.247, 0.347), vec2(-0.247, 0.357), segT);
    }
    if (localT >= 0.584 && localT <= 0.596) {
      float segT = (localT - 0.584) / 0.011;
      return mix(vec2(-0.247, 0.357), vec2(-0.247, 0.363), segT);
    }
    if (localT >= 0.596 && localT <= 0.607) {
      float segT = (localT - 0.596) / 0.011;
      return mix(vec2(-0.247, 0.363), vec2(-0.247, 0.370), segT);
    }
    if (localT >= 0.607 && localT <= 0.618) {
      float segT = (localT - 0.607) / 0.011;
      return mix(vec2(-0.247, 0.370), vec2(-0.247, 0.377), segT);
    }
    if (localT >= 0.618 && localT <= 0.629) {
      float segT = (localT - 0.618) / 0.011;
      return mix(vec2(-0.247, 0.377), vec2(-0.247, 0.380), segT);
    }
    if (localT >= 0.629 && localT <= 0.640) {
      float segT = (localT - 0.629) / 0.011;
      return mix(vec2(-0.247, 0.380), vec2(-0.247, 0.383), segT);
    }
    if (localT >= 0.640 && localT <= 0.652) {
      float segT = (localT - 0.640) / 0.011;
      return mix(vec2(-0.247, 0.383), vec2(-0.247, 0.390), segT);
    }
    if (localT >= 0.652 && localT <= 0.663) {
      float segT = (localT - 0.652) / 0.011;
      return mix(vec2(-0.247, 0.390), vec2(-0.247, 0.393), segT);
    }
    if (localT >= 0.663 && localT <= 0.674) {
      float segT = (localT - 0.663) / 0.011;
      return mix(vec2(-0.247, 0.393), vec2(-0.247, 0.397), segT);
    }
    if (localT >= 0.674 && localT <= 0.685) {
      float segT = (localT - 0.674) / 0.011;
      return mix(vec2(-0.247, 0.397), vec2(-0.247, 0.403), segT);
    }
    if (localT >= 0.685 && localT <= 0.697) {
      float segT = (localT - 0.685) / 0.011;
      return mix(vec2(-0.247, 0.403), vec2(-0.247, 0.410), segT);
    }
    if (localT >= 0.697 && localT <= 0.708) {
      float segT = (localT - 0.697) / 0.011;
      return mix(vec2(-0.247, 0.410), vec2(-0.243, 0.417), segT);
    }
    if (localT >= 0.708 && localT <= 0.719) {
      float segT = (localT - 0.708) / 0.011;
      return mix(vec2(-0.243, 0.417), vec2(-0.240, 0.423), segT);
    }
    if (localT >= 0.719 && localT <= 0.730) {
      float segT = (localT - 0.719) / 0.011;
      return mix(vec2(-0.240, 0.423), vec2(-0.240, 0.430), segT);
    }
    if (localT >= 0.730 && localT <= 0.742) {
      float segT = (localT - 0.730) / 0.011;
      return mix(vec2(-0.240, 0.430), vec2(-0.240, 0.433), segT);
    }
    if (localT >= 0.742 && localT <= 0.753) {
      float segT = (localT - 0.742) / 0.011;
      return mix(vec2(-0.240, 0.433), vec2(-0.237, 0.440), segT);
    }
    if (localT >= 0.753 && localT <= 0.764) {
      float segT = (localT - 0.753) / 0.011;
      return mix(vec2(-0.237, 0.440), vec2(-0.237, 0.443), segT);
    }
    if (localT >= 0.764 && localT <= 0.775) {
      float segT = (localT - 0.764) / 0.011;
      return mix(vec2(-0.237, 0.443), vec2(-0.233, 0.447), segT);
    }
    if (localT >= 0.775 && localT <= 0.787) {
      float segT = (localT - 0.775) / 0.011;
      return mix(vec2(-0.233, 0.447), vec2(-0.233, 0.450), segT);
    }
    if (localT >= 0.787 && localT <= 0.798) {
      float segT = (localT - 0.787) / 0.011;
      return mix(vec2(-0.233, 0.450), vec2(-0.233, 0.457), segT);
    }
    if (localT >= 0.798 && localT <= 0.809) {
      float segT = (localT - 0.798) / 0.011;
      return mix(vec2(-0.233, 0.457), vec2(-0.230, 0.463), segT);
    }
    if (localT >= 0.809 && localT <= 0.820) {
      float segT = (localT - 0.809) / 0.011;
      return mix(vec2(-0.230, 0.463), vec2(-0.227, 0.467), segT);
    }
    if (localT >= 0.820 && localT <= 0.831) {
      float segT = (localT - 0.820) / 0.011;
      return mix(vec2(-0.227, 0.467), vec2(-0.223, 0.473), segT);
    }
    if (localT >= 0.831 && localT <= 0.843) {
      float segT = (localT - 0.831) / 0.011;
      return mix(vec2(-0.223, 0.473), vec2(-0.223, 0.477), segT);
    }
    if (localT >= 0.843 && localT <= 0.854) {
      float segT = (localT - 0.843) / 0.011;
      return mix(vec2(-0.223, 0.477), vec2(-0.220, 0.483), segT);
    }
    if (localT >= 0.854 && localT <= 0.865) {
      float segT = (localT - 0.854) / 0.011;
      return mix(vec2(-0.220, 0.483), vec2(-0.217, 0.487), segT);
    }
    if (localT >= 0.865 && localT <= 0.876) {
      float segT = (localT - 0.865) / 0.011;
      return mix(vec2(-0.217, 0.487), vec2(-0.217, 0.490), segT);
    }
    if (localT >= 0.876 && localT <= 0.888) {
      float segT = (localT - 0.876) / 0.011;
      return mix(vec2(-0.217, 0.490), vec2(-0.217, 0.493), segT);
    }
    if (localT >= 0.888 && localT <= 0.899) {
      float segT = (localT - 0.888) / 0.011;
      return mix(vec2(-0.217, 0.493), vec2(-0.213, 0.493), segT);
    }
    if (localT >= 0.899 && localT <= 0.910) {
      float segT = (localT - 0.899) / 0.011;
      return mix(vec2(-0.213, 0.493), vec2(-0.210, 0.493), segT);
    }
    if (localT >= 0.910 && localT <= 0.921) {
      float segT = (localT - 0.910) / 0.011;
      return mix(vec2(-0.210, 0.493), vec2(-0.207, 0.493), segT);
    }
    if (localT >= 0.921 && localT <= 0.933) {
      float segT = (localT - 0.921) / 0.011;
      return mix(vec2(-0.207, 0.493), vec2(-0.203, 0.493), segT);
    }
    if (localT >= 0.933 && localT <= 0.944) {
      float segT = (localT - 0.933) / 0.011;
      return mix(vec2(-0.203, 0.493), vec2(-0.200, 0.493), segT);
    }
    if (localT >= 0.944 && localT <= 0.955) {
      float segT = (localT - 0.944) / 0.011;
      return mix(vec2(-0.200, 0.493), vec2(-0.197, 0.493), segT);
    }
    if (localT >= 0.955 && localT <= 0.966) {
      float segT = (localT - 0.955) / 0.011;
      return mix(vec2(-0.197, 0.493), vec2(-0.193, 0.493), segT);
    }
    if (localT >= 0.966 && localT <= 0.978) {
      float segT = (localT - 0.966) / 0.011;
      return mix(vec2(-0.193, 0.493), vec2(-0.190, 0.490), segT);
    }
    if (localT >= 0.978 && localT <= 0.989) {
      float segT = (localT - 0.978) / 0.011;
      return mix(vec2(-0.190, 0.490), vec2(-0.187, 0.490), segT);
    }
    if (localT >= 0.989 && localT <= 1.000) {
      float segT = (localT - 0.989) / 0.011;
      return mix(vec2(-0.187, 0.490), vec2(-0.183, 0.490), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 1) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.014) {
      float segT = (localT - 0.000) / 0.014;
      return mix(vec2(-0.142, 0.463), vec2(-0.142, 0.457), segT);
    }
    if (localT >= 0.014 && localT <= 0.028) {
      float segT = (localT - 0.014) / 0.014;
      return mix(vec2(-0.142, 0.457), vec2(-0.142, 0.450), segT);
    }
    if (localT >= 0.028 && localT <= 0.042) {
      float segT = (localT - 0.028) / 0.014;
      return mix(vec2(-0.142, 0.450), vec2(-0.142, 0.443), segT);
    }
    if (localT >= 0.042 && localT <= 0.056) {
      float segT = (localT - 0.042) / 0.014;
      return mix(vec2(-0.142, 0.443), vec2(-0.142, 0.433), segT);
    }
    if (localT >= 0.056 && localT <= 0.069) {
      float segT = (localT - 0.056) / 0.014;
      return mix(vec2(-0.142, 0.433), vec2(-0.142, 0.430), segT);
    }
    if (localT >= 0.069 && localT <= 0.083) {
      float segT = (localT - 0.069) / 0.014;
      return mix(vec2(-0.142, 0.430), vec2(-0.142, 0.427), segT);
    }
    if (localT >= 0.083 && localT <= 0.097) {
      float segT = (localT - 0.083) / 0.014;
      return mix(vec2(-0.142, 0.427), vec2(-0.142, 0.420), segT);
    }
    if (localT >= 0.097 && localT <= 0.111) {
      float segT = (localT - 0.097) / 0.014;
      return mix(vec2(-0.142, 0.420), vec2(-0.142, 0.417), segT);
    }
    if (localT >= 0.111 && localT <= 0.125) {
      float segT = (localT - 0.111) / 0.014;
      return mix(vec2(-0.142, 0.417), vec2(-0.142, 0.410), segT);
    }
    if (localT >= 0.125 && localT <= 0.139) {
      float segT = (localT - 0.125) / 0.014;
      return mix(vec2(-0.142, 0.410), vec2(-0.142, 0.403), segT);
    }
    if (localT >= 0.139 && localT <= 0.153) {
      float segT = (localT - 0.139) / 0.014;
      return mix(vec2(-0.142, 0.403), vec2(-0.142, 0.400), segT);
    }
    if (localT >= 0.153 && localT <= 0.167) {
      float segT = (localT - 0.153) / 0.014;
      return mix(vec2(-0.142, 0.400), vec2(-0.142, 0.397), segT);
    }
    if (localT >= 0.167 && localT <= 0.181) {
      float segT = (localT - 0.167) / 0.014;
      return mix(vec2(-0.142, 0.397), vec2(-0.142, 0.390), segT);
    }
    if (localT >= 0.181 && localT <= 0.194) {
      float segT = (localT - 0.181) / 0.014;
      return mix(vec2(-0.142, 0.390), vec2(-0.142, 0.387), segT);
    }
    if (localT >= 0.194 && localT <= 0.208) {
      float segT = (localT - 0.194) / 0.014;
      return mix(vec2(-0.142, 0.387), vec2(-0.142, 0.383), segT);
    }
    if (localT >= 0.208 && localT <= 0.222) {
      float segT = (localT - 0.208) / 0.014;
      return mix(vec2(-0.142, 0.383), vec2(-0.142, 0.380), segT);
    }
    if (localT >= 0.222 && localT <= 0.236) {
      float segT = (localT - 0.222) / 0.014;
      return mix(vec2(-0.142, 0.380), vec2(-0.142, 0.373), segT);
    }
    if (localT >= 0.236 && localT <= 0.250) {
      float segT = (localT - 0.236) / 0.014;
      return mix(vec2(-0.142, 0.373), vec2(-0.142, 0.370), segT);
    }
    if (localT >= 0.250 && localT <= 0.264) {
      float segT = (localT - 0.250) / 0.014;
      return mix(vec2(-0.142, 0.370), vec2(-0.142, 0.367), segT);
    }
    if (localT >= 0.264 && localT <= 0.278) {
      float segT = (localT - 0.264) / 0.014;
      return mix(vec2(-0.142, 0.367), vec2(-0.142, 0.360), segT);
    }
    if (localT >= 0.278 && localT <= 0.292) {
      float segT = (localT - 0.278) / 0.014;
      return mix(vec2(-0.142, 0.360), vec2(-0.142, 0.350), segT);
    }
    if (localT >= 0.292 && localT <= 0.306) {
      float segT = (localT - 0.292) / 0.014;
      return mix(vec2(-0.142, 0.350), vec2(-0.142, 0.347), segT);
    }
    if (localT >= 0.306 && localT <= 0.319) {
      float segT = (localT - 0.306) / 0.014;
      return mix(vec2(-0.142, 0.347), vec2(-0.142, 0.340), segT);
    }
    if (localT >= 0.319 && localT <= 0.333) {
      float segT = (localT - 0.319) / 0.014;
      return mix(vec2(-0.142, 0.340), vec2(-0.142, 0.337), segT);
    }
    if (localT >= 0.333 && localT <= 0.347) {
      float segT = (localT - 0.333) / 0.014;
      return mix(vec2(-0.142, 0.337), vec2(-0.142, 0.330), segT);
    }
    if (localT >= 0.347 && localT <= 0.361) {
      float segT = (localT - 0.347) / 0.014;
      return mix(vec2(-0.142, 0.330), vec2(-0.142, 0.323), segT);
    }
    if (localT >= 0.361 && localT <= 0.375) {
      float segT = (localT - 0.361) / 0.014;
      return mix(vec2(-0.142, 0.323), vec2(-0.142, 0.313), segT);
    }
    if (localT >= 0.375 && localT <= 0.389) {
      float segT = (localT - 0.375) / 0.014;
      return mix(vec2(-0.142, 0.313), vec2(-0.142, 0.310), segT);
    }
    if (localT >= 0.389 && localT <= 0.403) {
      float segT = (localT - 0.389) / 0.014;
      return mix(vec2(-0.142, 0.310), vec2(-0.142, 0.300), segT);
    }
    if (localT >= 0.403 && localT <= 0.417) {
      float segT = (localT - 0.403) / 0.014;
      return mix(vec2(-0.142, 0.300), vec2(-0.142, 0.293), segT);
    }
    if (localT >= 0.417 && localT <= 0.431) {
      float segT = (localT - 0.417) / 0.014;
      return mix(vec2(-0.142, 0.293), vec2(-0.142, 0.287), segT);
    }
    if (localT >= 0.431 && localT <= 0.444) {
      float segT = (localT - 0.431) / 0.014;
      return mix(vec2(-0.142, 0.287), vec2(-0.142, 0.277), segT);
    }
    if (localT >= 0.444 && localT <= 0.458) {
      float segT = (localT - 0.444) / 0.014;
      return mix(vec2(-0.142, 0.277), vec2(-0.142, 0.273), segT);
    }
    if (localT >= 0.458 && localT <= 0.472) {
      float segT = (localT - 0.458) / 0.014;
      return mix(vec2(-0.142, 0.273), vec2(-0.142, 0.263), segT);
    }
    if (localT >= 0.472 && localT <= 0.486) {
      float segT = (localT - 0.472) / 0.014;
      return mix(vec2(-0.142, 0.263), vec2(-0.142, 0.260), segT);
    }
    if (localT >= 0.486 && localT <= 0.500) {
      float segT = (localT - 0.486) / 0.014;
      return mix(vec2(-0.142, 0.260), vec2(-0.142, 0.250), segT);
    }
    if (localT >= 0.500 && localT <= 0.514) {
      float segT = (localT - 0.500) / 0.014;
      return mix(vec2(-0.142, 0.250), vec2(-0.142, 0.247), segT);
    }
    if (localT >= 0.514 && localT <= 0.528) {
      float segT = (localT - 0.514) / 0.014;
      return mix(vec2(-0.142, 0.247), vec2(-0.142, 0.240), segT);
    }
    if (localT >= 0.528 && localT <= 0.542) {
      float segT = (localT - 0.528) / 0.014;
      return mix(vec2(-0.142, 0.240), vec2(-0.142, 0.237), segT);
    }
    if (localT >= 0.542 && localT <= 0.556) {
      float segT = (localT - 0.542) / 0.014;
      return mix(vec2(-0.142, 0.237), vec2(-0.145, 0.230), segT);
    }
    if (localT >= 0.556 && localT <= 0.569) {
      float segT = (localT - 0.556) / 0.014;
      return mix(vec2(-0.145, 0.230), vec2(-0.145, 0.227), segT);
    }
    if (localT >= 0.569 && localT <= 0.583) {
      float segT = (localT - 0.569) / 0.014;
      return mix(vec2(-0.145, 0.227), vec2(-0.148, 0.223), segT);
    }
    if (localT >= 0.583 && localT <= 0.597) {
      float segT = (localT - 0.583) / 0.014;
      return mix(vec2(-0.148, 0.223), vec2(-0.148, 0.217), segT);
    }
    if (localT >= 0.597 && localT <= 0.611) {
      float segT = (localT - 0.597) / 0.014;
      return mix(vec2(-0.148, 0.217), vec2(-0.148, 0.213), segT);
    }
    if (localT >= 0.611 && localT <= 0.625) {
      float segT = (localT - 0.611) / 0.014;
      return mix(vec2(-0.148, 0.213), vec2(-0.148, 0.207), segT);
    }
    if (localT >= 0.625 && localT <= 0.639) {
      float segT = (localT - 0.625) / 0.014;
      return mix(vec2(-0.148, 0.207), vec2(-0.148, 0.203), segT);
    }
    if (localT >= 0.639 && localT <= 0.653) {
      float segT = (localT - 0.639) / 0.014;
      return mix(vec2(-0.148, 0.203), vec2(-0.148, 0.197), segT);
    }
    if (localT >= 0.653 && localT <= 0.667) {
      float segT = (localT - 0.653) / 0.014;
      return mix(vec2(-0.148, 0.197), vec2(-0.152, 0.193), segT);
    }
    if (localT >= 0.667 && localT <= 0.681) {
      float segT = (localT - 0.667) / 0.014;
      return mix(vec2(-0.152, 0.193), vec2(-0.152, 0.190), segT);
    }
    if (localT >= 0.681 && localT <= 0.694) {
      float segT = (localT - 0.681) / 0.014;
      return mix(vec2(-0.152, 0.190), vec2(-0.152, 0.187), segT);
    }
    if (localT >= 0.694 && localT <= 0.708) {
      float segT = (localT - 0.694) / 0.014;
      return mix(vec2(-0.152, 0.187), vec2(-0.152, 0.183), segT);
    }
    if (localT >= 0.708 && localT <= 0.722) {
      float segT = (localT - 0.708) / 0.014;
      return mix(vec2(-0.152, 0.183), vec2(-0.152, 0.180), segT);
    }
    if (localT >= 0.722 && localT <= 0.736) {
      float segT = (localT - 0.722) / 0.014;
      return mix(vec2(-0.152, 0.180), vec2(-0.155, 0.177), segT);
    }
    if (localT >= 0.736 && localT <= 0.750) {
      float segT = (localT - 0.736) / 0.014;
      return mix(vec2(-0.155, 0.177), vec2(-0.155, 0.173), segT);
    }
    if (localT >= 0.750 && localT <= 0.764) {
      float segT = (localT - 0.750) / 0.014;
      return mix(vec2(-0.155, 0.173), vec2(-0.155, 0.167), segT);
    }
    if (localT >= 0.764 && localT <= 0.778) {
      float segT = (localT - 0.764) / 0.014;
      return mix(vec2(-0.155, 0.167), vec2(-0.155, 0.160), segT);
    }
    if (localT >= 0.778 && localT <= 0.792) {
      float segT = (localT - 0.778) / 0.014;
      return mix(vec2(-0.155, 0.160), vec2(-0.158, 0.153), segT);
    }
    if (localT >= 0.792 && localT <= 0.806) {
      float segT = (localT - 0.792) / 0.014;
      return mix(vec2(-0.158, 0.153), vec2(-0.162, 0.150), segT);
    }
    if (localT >= 0.806 && localT <= 0.819) {
      float segT = (localT - 0.806) / 0.014;
      return mix(vec2(-0.162, 0.150), vec2(-0.162, 0.147), segT);
    }
    if (localT >= 0.819 && localT <= 0.833) {
      float segT = (localT - 0.819) / 0.014;
      return mix(vec2(-0.162, 0.147), vec2(-0.162, 0.143), segT);
    }
    if (localT >= 0.833 && localT <= 0.847) {
      float segT = (localT - 0.833) / 0.014;
      return mix(vec2(-0.162, 0.143), vec2(-0.165, 0.140), segT);
    }
    if (localT >= 0.847 && localT <= 0.861) {
      float segT = (localT - 0.847) / 0.014;
      return mix(vec2(-0.165, 0.140), vec2(-0.165, 0.137), segT);
    }
    if (localT >= 0.861 && localT <= 0.875) {
      float segT = (localT - 0.861) / 0.014;
      return mix(vec2(-0.165, 0.137), vec2(-0.165, 0.133), segT);
    }
    if (localT >= 0.875 && localT <= 0.889) {
      float segT = (localT - 0.875) / 0.014;
      return mix(vec2(-0.165, 0.133), vec2(-0.165, 0.130), segT);
    }
    if (localT >= 0.889 && localT <= 0.903) {
      float segT = (localT - 0.889) / 0.014;
      return mix(vec2(-0.165, 0.130), vec2(-0.168, 0.127), segT);
    }
    if (localT >= 0.903 && localT <= 0.917) {
      float segT = (localT - 0.903) / 0.014;
      return mix(vec2(-0.168, 0.127), vec2(-0.168, 0.123), segT);
    }
    if (localT >= 0.917 && localT <= 0.931) {
      float segT = (localT - 0.917) / 0.014;
      return mix(vec2(-0.168, 0.123), vec2(-0.168, 0.120), segT);
    }
    if (localT >= 0.931 && localT <= 0.944) {
      float segT = (localT - 0.931) / 0.014;
      return mix(vec2(-0.168, 0.120), vec2(-0.168, 0.117), segT);
    }
    if (localT >= 0.944 && localT <= 0.958) {
      float segT = (localT - 0.944) / 0.014;
      return mix(vec2(-0.168, 0.117), vec2(-0.168, 0.113), segT);
    }
    if (localT >= 0.958 && localT <= 0.972) {
      float segT = (localT - 0.958) / 0.014;
      return mix(vec2(-0.168, 0.113), vec2(-0.168, 0.110), segT);
    }
    if (localT >= 0.972 && localT <= 0.986) {
      float segT = (localT - 0.972) / 0.014;
      return mix(vec2(-0.168, 0.110), vec2(-0.168, 0.107), segT);
    }
    if (localT >= 0.986 && localT <= 1.000) {
      float segT = (localT - 0.986) / 0.014;
      return mix(vec2(-0.168, 0.107), vec2(-0.168, 0.103), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 2) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.011) {
      float segT = (localT - 0.000) / 0.011;
      return mix(vec2(-0.128, 0.540), vec2(-0.128, 0.533), segT);
    }
    if (localT >= 0.011 && localT <= 0.022) {
      float segT = (localT - 0.011) / 0.011;
      return mix(vec2(-0.128, 0.533), vec2(-0.125, 0.527), segT);
    }
    if (localT >= 0.022 && localT <= 0.033) {
      float segT = (localT - 0.022) / 0.011;
      return mix(vec2(-0.125, 0.527), vec2(-0.125, 0.523), segT);
    }
    if (localT >= 0.033 && localT <= 0.043) {
      float segT = (localT - 0.033) / 0.011;
      return mix(vec2(-0.125, 0.523), vec2(-0.118, 0.513), segT);
    }
    if (localT >= 0.043 && localT <= 0.054) {
      float segT = (localT - 0.043) / 0.011;
      return mix(vec2(-0.118, 0.513), vec2(-0.118, 0.507), segT);
    }
    if (localT >= 0.054 && localT <= 0.065) {
      float segT = (localT - 0.054) / 0.011;
      return mix(vec2(-0.118, 0.507), vec2(-0.115, 0.497), segT);
    }
    if (localT >= 0.065 && localT <= 0.076) {
      float segT = (localT - 0.065) / 0.011;
      return mix(vec2(-0.115, 0.497), vec2(-0.115, 0.490), segT);
    }
    if (localT >= 0.076 && localT <= 0.087) {
      float segT = (localT - 0.076) / 0.011;
      return mix(vec2(-0.115, 0.490), vec2(-0.112, 0.483), segT);
    }
    if (localT >= 0.087 && localT <= 0.098) {
      float segT = (localT - 0.087) / 0.011;
      return mix(vec2(-0.112, 0.483), vec2(-0.108, 0.477), segT);
    }
    if (localT >= 0.098 && localT <= 0.109) {
      float segT = (localT - 0.098) / 0.011;
      return mix(vec2(-0.108, 0.477), vec2(-0.105, 0.467), segT);
    }
    if (localT >= 0.109 && localT <= 0.120) {
      float segT = (localT - 0.109) / 0.011;
      return mix(vec2(-0.105, 0.467), vec2(-0.105, 0.460), segT);
    }
    if (localT >= 0.120 && localT <= 0.130) {
      float segT = (localT - 0.120) / 0.011;
      return mix(vec2(-0.105, 0.460), vec2(-0.102, 0.447), segT);
    }
    if (localT >= 0.130 && localT <= 0.141) {
      float segT = (localT - 0.130) / 0.011;
      return mix(vec2(-0.102, 0.447), vec2(-0.095, 0.437), segT);
    }
    if (localT >= 0.141 && localT <= 0.152) {
      float segT = (localT - 0.141) / 0.011;
      return mix(vec2(-0.095, 0.437), vec2(-0.095, 0.430), segT);
    }
    if (localT >= 0.152 && localT <= 0.163) {
      float segT = (localT - 0.152) / 0.011;
      return mix(vec2(-0.095, 0.430), vec2(-0.092, 0.420), segT);
    }
    if (localT >= 0.163 && localT <= 0.174) {
      float segT = (localT - 0.163) / 0.011;
      return mix(vec2(-0.092, 0.420), vec2(-0.088, 0.410), segT);
    }
    if (localT >= 0.174 && localT <= 0.185) {
      float segT = (localT - 0.174) / 0.011;
      return mix(vec2(-0.088, 0.410), vec2(-0.085, 0.403), segT);
    }
    if (localT >= 0.185 && localT <= 0.196) {
      float segT = (localT - 0.185) / 0.011;
      return mix(vec2(-0.085, 0.403), vec2(-0.085, 0.393), segT);
    }
    if (localT >= 0.196 && localT <= 0.207) {
      float segT = (localT - 0.196) / 0.011;
      return mix(vec2(-0.085, 0.393), vec2(-0.082, 0.380), segT);
    }
    if (localT >= 0.207 && localT <= 0.217) {
      float segT = (localT - 0.207) / 0.011;
      return mix(vec2(-0.082, 0.380), vec2(-0.078, 0.373), segT);
    }
    if (localT >= 0.217 && localT <= 0.228) {
      float segT = (localT - 0.217) / 0.011;
      return mix(vec2(-0.078, 0.373), vec2(-0.072, 0.357), segT);
    }
    if (localT >= 0.228 && localT <= 0.239) {
      float segT = (localT - 0.228) / 0.011;
      return mix(vec2(-0.072, 0.357), vec2(-0.068, 0.347), segT);
    }
    if (localT >= 0.239 && localT <= 0.250) {
      float segT = (localT - 0.239) / 0.011;
      return mix(vec2(-0.068, 0.347), vec2(-0.065, 0.340), segT);
    }
    if (localT >= 0.250 && localT <= 0.261) {
      float segT = (localT - 0.250) / 0.011;
      return mix(vec2(-0.065, 0.340), vec2(-0.065, 0.330), segT);
    }
    if (localT >= 0.261 && localT <= 0.272) {
      float segT = (localT - 0.261) / 0.011;
      return mix(vec2(-0.065, 0.330), vec2(-0.062, 0.320), segT);
    }
    if (localT >= 0.272 && localT <= 0.283) {
      float segT = (localT - 0.272) / 0.011;
      return mix(vec2(-0.062, 0.320), vec2(-0.062, 0.310), segT);
    }
    if (localT >= 0.283 && localT <= 0.293) {
      float segT = (localT - 0.283) / 0.011;
      return mix(vec2(-0.062, 0.310), vec2(-0.062, 0.300), segT);
    }
    if (localT >= 0.293 && localT <= 0.304) {
      float segT = (localT - 0.293) / 0.011;
      return mix(vec2(-0.062, 0.300), vec2(-0.058, 0.290), segT);
    }
    if (localT >= 0.304 && localT <= 0.315) {
      float segT = (localT - 0.304) / 0.011;
      return mix(vec2(-0.058, 0.290), vec2(-0.058, 0.280), segT);
    }
    if (localT >= 0.315 && localT <= 0.326) {
      float segT = (localT - 0.315) / 0.011;
      return mix(vec2(-0.058, 0.280), vec2(-0.055, 0.270), segT);
    }
    if (localT >= 0.326 && localT <= 0.337) {
      float segT = (localT - 0.326) / 0.011;
      return mix(vec2(-0.055, 0.270), vec2(-0.055, 0.263), segT);
    }
    if (localT >= 0.337 && localT <= 0.348) {
      float segT = (localT - 0.337) / 0.011;
      return mix(vec2(-0.055, 0.263), vec2(-0.052, 0.250), segT);
    }
    if (localT >= 0.348 && localT <= 0.359) {
      float segT = (localT - 0.348) / 0.011;
      return mix(vec2(-0.052, 0.250), vec2(-0.052, 0.243), segT);
    }
    if (localT >= 0.359 && localT <= 0.370) {
      float segT = (localT - 0.359) / 0.011;
      return mix(vec2(-0.052, 0.243), vec2(-0.052, 0.230), segT);
    }
    if (localT >= 0.370 && localT <= 0.380) {
      float segT = (localT - 0.370) / 0.011;
      return mix(vec2(-0.052, 0.230), vec2(-0.052, 0.223), segT);
    }
    if (localT >= 0.380 && localT <= 0.391) {
      float segT = (localT - 0.380) / 0.011;
      return mix(vec2(-0.052, 0.223), vec2(-0.048, 0.210), segT);
    }
    if (localT >= 0.391 && localT <= 0.402) {
      float segT = (localT - 0.391) / 0.011;
      return mix(vec2(-0.048, 0.210), vec2(-0.045, 0.187), segT);
    }
    if (localT >= 0.402 && localT <= 0.413) {
      float segT = (localT - 0.402) / 0.011;
      return mix(vec2(-0.045, 0.187), vec2(-0.045, 0.180), segT);
    }
    if (localT >= 0.413 && localT <= 0.424) {
      float segT = (localT - 0.413) / 0.011;
      return mix(vec2(-0.045, 0.180), vec2(-0.042, 0.170), segT);
    }
    if (localT >= 0.424 && localT <= 0.435) {
      float segT = (localT - 0.424) / 0.011;
      return mix(vec2(-0.042, 0.170), vec2(-0.042, 0.163), segT);
    }
    if (localT >= 0.435 && localT <= 0.446) {
      float segT = (localT - 0.435) / 0.011;
      return mix(vec2(-0.042, 0.163), vec2(-0.042, 0.160), segT);
    }
    if (localT >= 0.446 && localT <= 0.457) {
      float segT = (localT - 0.446) / 0.011;
      return mix(vec2(-0.042, 0.160), vec2(-0.042, 0.153), segT);
    }
    if (localT >= 0.457 && localT <= 0.467) {
      float segT = (localT - 0.457) / 0.011;
      return mix(vec2(-0.042, 0.153), vec2(-0.042, 0.150), segT);
    }
    if (localT >= 0.467 && localT <= 0.478) {
      float segT = (localT - 0.467) / 0.011;
      return mix(vec2(-0.042, 0.150), vec2(-0.038, 0.147), segT);
    }
    if (localT >= 0.478 && localT <= 0.489) {
      float segT = (localT - 0.478) / 0.011;
      return mix(vec2(-0.038, 0.147), vec2(-0.038, 0.143), segT);
    }
    if (localT >= 0.489 && localT <= 0.500) {
      float segT = (localT - 0.489) / 0.011;
      return mix(vec2(-0.038, 0.143), vec2(-0.038, 0.140), segT);
    }
    if (localT >= 0.500 && localT <= 0.511) {
      float segT = (localT - 0.500) / 0.011;
      return mix(vec2(-0.038, 0.140), vec2(-0.038, 0.137), segT);
    }
    if (localT >= 0.511 && localT <= 0.522) {
      float segT = (localT - 0.511) / 0.011;
      return mix(vec2(-0.038, 0.137), vec2(-0.035, 0.130), segT);
    }
    if (localT >= 0.522 && localT <= 0.533) {
      float segT = (localT - 0.522) / 0.011;
      return mix(vec2(-0.035, 0.130), vec2(-0.035, 0.127), segT);
    }
    if (localT >= 0.533 && localT <= 0.543) {
      float segT = (localT - 0.533) / 0.011;
      return mix(vec2(-0.035, 0.127), vec2(-0.035, 0.123), segT);
    }
    if (localT >= 0.543 && localT <= 0.554) {
      float segT = (localT - 0.543) / 0.011;
      return mix(vec2(-0.035, 0.123), vec2(-0.032, 0.120), segT);
    }
    if (localT >= 0.554 && localT <= 0.565) {
      float segT = (localT - 0.554) / 0.011;
      return mix(vec2(-0.032, 0.120), vec2(-0.028, 0.117), segT);
    }
    if (localT >= 0.565 && localT <= 0.576) {
      float segT = (localT - 0.565) / 0.011;
      return mix(vec2(-0.028, 0.117), vec2(-0.028, 0.113), segT);
    }
    if (localT >= 0.576 && localT <= 0.587) {
      float segT = (localT - 0.576) / 0.011;
      return mix(vec2(-0.028, 0.113), vec2(-0.025, 0.113), segT);
    }
    if (localT >= 0.587 && localT <= 0.598) {
      float segT = (localT - 0.587) / 0.011;
      return mix(vec2(-0.025, 0.113), vec2(-0.022, 0.113), segT);
    }
    if (localT >= 0.598 && localT <= 0.609) {
      float segT = (localT - 0.598) / 0.011;
      return mix(vec2(-0.022, 0.113), vec2(-0.018, 0.113), segT);
    }
    if (localT >= 0.609 && localT <= 0.620) {
      float segT = (localT - 0.609) / 0.011;
      return mix(vec2(-0.018, 0.113), vec2(-0.015, 0.113), segT);
    }
    if (localT >= 0.620 && localT <= 0.630) {
      float segT = (localT - 0.620) / 0.011;
      return mix(vec2(-0.015, 0.113), vec2(-0.012, 0.113), segT);
    }
    if (localT >= 0.630 && localT <= 0.641) {
      float segT = (localT - 0.630) / 0.011;
      return mix(vec2(-0.012, 0.113), vec2(-0.008, 0.113), segT);
    }
    if (localT >= 0.641 && localT <= 0.652) {
      float segT = (localT - 0.641) / 0.011;
      return mix(vec2(-0.008, 0.113), vec2(-0.005, 0.113), segT);
    }
    if (localT >= 0.652 && localT <= 0.663) {
      float segT = (localT - 0.652) / 0.011;
      return mix(vec2(-0.005, 0.113), vec2(-0.002, 0.113), segT);
    }
    if (localT >= 0.663 && localT <= 0.674) {
      float segT = (localT - 0.663) / 0.011;
      return mix(vec2(-0.002, 0.113), vec2(0.002, 0.113), segT);
    }
    if (localT >= 0.674 && localT <= 0.685) {
      float segT = (localT - 0.674) / 0.011;
      return mix(vec2(0.002, 0.113), vec2(0.008, 0.117), segT);
    }
    if (localT >= 0.685 && localT <= 0.696) {
      float segT = (localT - 0.685) / 0.011;
      return mix(vec2(0.008, 0.117), vec2(0.008, 0.127), segT);
    }
    if (localT >= 0.696 && localT <= 0.707) {
      float segT = (localT - 0.696) / 0.011;
      return mix(vec2(0.008, 0.127), vec2(0.012, 0.137), segT);
    }
    if (localT >= 0.707 && localT <= 0.717) {
      float segT = (localT - 0.707) / 0.011;
      return mix(vec2(0.012, 0.137), vec2(0.015, 0.147), segT);
    }
    if (localT >= 0.717 && localT <= 0.728) {
      float segT = (localT - 0.717) / 0.011;
      return mix(vec2(0.015, 0.147), vec2(0.018, 0.157), segT);
    }
    if (localT >= 0.728 && localT <= 0.739) {
      float segT = (localT - 0.728) / 0.011;
      return mix(vec2(0.018, 0.157), vec2(0.022, 0.177), segT);
    }
    if (localT >= 0.739 && localT <= 0.750) {
      float segT = (localT - 0.739) / 0.011;
      return mix(vec2(0.022, 0.177), vec2(0.025, 0.193), segT);
    }
    if (localT >= 0.750 && localT <= 0.761) {
      float segT = (localT - 0.750) / 0.011;
      return mix(vec2(0.025, 0.193), vec2(0.032, 0.213), segT);
    }
    if (localT >= 0.761 && localT <= 0.772) {
      float segT = (localT - 0.761) / 0.011;
      return mix(vec2(0.032, 0.213), vec2(0.032, 0.227), segT);
    }
    if (localT >= 0.772 && localT <= 0.783) {
      float segT = (localT - 0.772) / 0.011;
      return mix(vec2(0.032, 0.227), vec2(0.032, 0.240), segT);
    }
    if (localT >= 0.783 && localT <= 0.793) {
      float segT = (localT - 0.783) / 0.011;
      return mix(vec2(0.032, 0.240), vec2(0.035, 0.263), segT);
    }
    if (localT >= 0.793 && localT <= 0.804) {
      float segT = (localT - 0.793) / 0.011;
      return mix(vec2(0.035, 0.263), vec2(0.045, 0.283), segT);
    }
    if (localT >= 0.804 && localT <= 0.815) {
      float segT = (localT - 0.804) / 0.011;
      return mix(vec2(0.045, 0.283), vec2(0.045, 0.297), segT);
    }
    if (localT >= 0.815 && localT <= 0.826) {
      float segT = (localT - 0.815) / 0.011;
      return mix(vec2(0.045, 0.297), vec2(0.048, 0.313), segT);
    }
    if (localT >= 0.826 && localT <= 0.837) {
      float segT = (localT - 0.826) / 0.011;
      return mix(vec2(0.048, 0.313), vec2(0.052, 0.327), segT);
    }
    if (localT >= 0.837 && localT <= 0.848) {
      float segT = (localT - 0.837) / 0.011;
      return mix(vec2(0.052, 0.327), vec2(0.055, 0.347), segT);
    }
    if (localT >= 0.848 && localT <= 0.859) {
      float segT = (localT - 0.848) / 0.011;
      return mix(vec2(0.055, 0.347), vec2(0.062, 0.383), segT);
    }
    if (localT >= 0.859 && localT <= 0.870) {
      float segT = (localT - 0.859) / 0.011;
      return mix(vec2(0.062, 0.383), vec2(0.062, 0.397), segT);
    }
    if (localT >= 0.870 && localT <= 0.880) {
      float segT = (localT - 0.870) / 0.011;
      return mix(vec2(0.062, 0.397), vec2(0.065, 0.410), segT);
    }
    if (localT >= 0.880 && localT <= 0.891) {
      float segT = (localT - 0.880) / 0.011;
      return mix(vec2(0.065, 0.410), vec2(0.068, 0.420), segT);
    }
    if (localT >= 0.891 && localT <= 0.902) {
      float segT = (localT - 0.891) / 0.011;
      return mix(vec2(0.068, 0.420), vec2(0.068, 0.430), segT);
    }
    if (localT >= 0.902 && localT <= 0.913) {
      float segT = (localT - 0.902) / 0.011;
      return mix(vec2(0.068, 0.430), vec2(0.068, 0.440), segT);
    }
    if (localT >= 0.913 && localT <= 0.924) {
      float segT = (localT - 0.913) / 0.011;
      return mix(vec2(0.068, 0.440), vec2(0.072, 0.453), segT);
    }
    if (localT >= 0.924 && localT <= 0.935) {
      float segT = (localT - 0.924) / 0.011;
      return mix(vec2(0.072, 0.453), vec2(0.075, 0.460), segT);
    }
    if (localT >= 0.935 && localT <= 0.946) {
      float segT = (localT - 0.935) / 0.011;
      return mix(vec2(0.075, 0.460), vec2(0.078, 0.463), segT);
    }
    if (localT >= 0.946 && localT <= 0.957) {
      float segT = (localT - 0.946) / 0.011;
      return mix(vec2(0.078, 0.463), vec2(0.078, 0.470), segT);
    }
    if (localT >= 0.957 && localT <= 0.967) {
      float segT = (localT - 0.957) / 0.011;
      return mix(vec2(0.078, 0.470), vec2(0.078, 0.473), segT);
    }
    if (localT >= 0.967 && localT <= 0.978) {
      float segT = (localT - 0.967) / 0.011;
      return mix(vec2(0.078, 0.473), vec2(0.078, 0.477), segT);
    }
    if (localT >= 0.978 && localT <= 0.989) {
      float segT = (localT - 0.978) / 0.011;
      return mix(vec2(0.078, 0.477), vec2(0.082, 0.480), segT);
    }
    if (localT >= 0.989 && localT <= 1.000) {
      float segT = (localT - 0.989) / 0.011;
      return mix(vec2(0.082, 0.480), vec2(0.082, 0.483), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 3) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.004) {
      float segT = (localT - 0.000) / 0.004;
      return mix(vec2(-0.025, 0.087), vec2(-0.022, 0.090), segT);
    }
    if (localT >= 0.004 && localT <= 0.008) {
      float segT = (localT - 0.004) / 0.004;
      return mix(vec2(-0.022, 0.090), vec2(-0.018, 0.090), segT);
    }
    if (localT >= 0.008 && localT <= 0.012) {
      float segT = (localT - 0.008) / 0.004;
      return mix(vec2(-0.018, 0.090), vec2(-0.015, 0.093), segT);
    }
    if (localT >= 0.012 && localT <= 0.016) {
      float segT = (localT - 0.012) / 0.004;
      return mix(vec2(-0.015, 0.093), vec2(-0.012, 0.097), segT);
    }
    if (localT >= 0.016 && localT <= 0.020) {
      float segT = (localT - 0.016) / 0.004;
      return mix(vec2(-0.012, 0.097), vec2(-0.005, 0.097), segT);
    }
    if (localT >= 0.020 && localT <= 0.025) {
      float segT = (localT - 0.020) / 0.004;
      return mix(vec2(-0.005, 0.097), vec2(0.005, 0.103), segT);
    }
    if (localT >= 0.025 && localT <= 0.029) {
      float segT = (localT - 0.025) / 0.004;
      return mix(vec2(0.005, 0.103), vec2(0.012, 0.107), segT);
    }
    if (localT >= 0.029 && localT <= 0.033) {
      float segT = (localT - 0.029) / 0.004;
      return mix(vec2(0.012, 0.107), vec2(0.022, 0.110), segT);
    }
    if (localT >= 0.033 && localT <= 0.037) {
      float segT = (localT - 0.033) / 0.004;
      return mix(vec2(0.022, 0.110), vec2(0.028, 0.113), segT);
    }
    if (localT >= 0.037 && localT <= 0.041) {
      float segT = (localT - 0.037) / 0.004;
      return mix(vec2(0.028, 0.113), vec2(0.032, 0.117), segT);
    }
    if (localT >= 0.041 && localT <= 0.045) {
      float segT = (localT - 0.041) / 0.004;
      return mix(vec2(0.032, 0.117), vec2(0.045, 0.123), segT);
    }
    if (localT >= 0.045 && localT <= 0.049) {
      float segT = (localT - 0.045) / 0.004;
      return mix(vec2(0.045, 0.123), vec2(0.048, 0.123), segT);
    }
    if (localT >= 0.049 && localT <= 0.053) {
      float segT = (localT - 0.049) / 0.004;
      return mix(vec2(0.048, 0.123), vec2(0.052, 0.123), segT);
    }
    if (localT >= 0.053 && localT <= 0.057) {
      float segT = (localT - 0.053) / 0.004;
      return mix(vec2(0.052, 0.123), vec2(0.055, 0.127), segT);
    }
    if (localT >= 0.057 && localT <= 0.061) {
      float segT = (localT - 0.057) / 0.004;
      return mix(vec2(0.055, 0.127), vec2(0.058, 0.130), segT);
    }
    if (localT >= 0.061 && localT <= 0.066) {
      float segT = (localT - 0.061) / 0.004;
      return mix(vec2(0.058, 0.130), vec2(0.062, 0.130), segT);
    }
    if (localT >= 0.066 && localT <= 0.070) {
      float segT = (localT - 0.066) / 0.004;
      return mix(vec2(0.062, 0.130), vec2(0.065, 0.130), segT);
    }
    if (localT >= 0.070 && localT <= 0.074) {
      float segT = (localT - 0.070) / 0.004;
      return mix(vec2(0.065, 0.130), vec2(0.068, 0.133), segT);
    }
    if (localT >= 0.074 && localT <= 0.078) {
      float segT = (localT - 0.074) / 0.004;
      return mix(vec2(0.068, 0.133), vec2(0.075, 0.137), segT);
    }
    if (localT >= 0.078 && localT <= 0.082) {
      float segT = (localT - 0.078) / 0.004;
      return mix(vec2(0.075, 0.137), vec2(0.082, 0.137), segT);
    }
    if (localT >= 0.082 && localT <= 0.086) {
      float segT = (localT - 0.082) / 0.004;
      return mix(vec2(0.082, 0.137), vec2(0.085, 0.137), segT);
    }
    if (localT >= 0.086 && localT <= 0.090) {
      float segT = (localT - 0.086) / 0.004;
      return mix(vec2(0.085, 0.137), vec2(0.088, 0.140), segT);
    }
    if (localT >= 0.090 && localT <= 0.094) {
      float segT = (localT - 0.090) / 0.004;
      return mix(vec2(0.088, 0.140), vec2(0.092, 0.140), segT);
    }
    if (localT >= 0.094 && localT <= 0.098) {
      float segT = (localT - 0.094) / 0.004;
      return mix(vec2(0.092, 0.140), vec2(0.098, 0.140), segT);
    }
    if (localT >= 0.098 && localT <= 0.102) {
      float segT = (localT - 0.098) / 0.004;
      return mix(vec2(0.098, 0.140), vec2(0.105, 0.143), segT);
    }
    if (localT >= 0.102 && localT <= 0.107) {
      float segT = (localT - 0.102) / 0.004;
      return mix(vec2(0.105, 0.143), vec2(0.108, 0.143), segT);
    }
    if (localT >= 0.107 && localT <= 0.111) {
      float segT = (localT - 0.107) / 0.004;
      return mix(vec2(0.108, 0.143), vec2(0.118, 0.147), segT);
    }
    if (localT >= 0.111 && localT <= 0.115) {
      float segT = (localT - 0.111) / 0.004;
      return mix(vec2(0.118, 0.147), vec2(0.125, 0.147), segT);
    }
    if (localT >= 0.115 && localT <= 0.119) {
      float segT = (localT - 0.115) / 0.004;
      return mix(vec2(0.125, 0.147), vec2(0.132, 0.147), segT);
    }
    if (localT >= 0.119 && localT <= 0.123) {
      float segT = (localT - 0.119) / 0.004;
      return mix(vec2(0.132, 0.147), vec2(0.135, 0.150), segT);
    }
    if (localT >= 0.123 && localT <= 0.127) {
      float segT = (localT - 0.123) / 0.004;
      return mix(vec2(0.135, 0.150), vec2(0.155, 0.150), segT);
    }
    if (localT >= 0.127 && localT <= 0.131) {
      float segT = (localT - 0.127) / 0.004;
      return mix(vec2(0.155, 0.150), vec2(0.158, 0.150), segT);
    }
    if (localT >= 0.131 && localT <= 0.135) {
      float segT = (localT - 0.131) / 0.004;
      return mix(vec2(0.158, 0.150), vec2(0.162, 0.150), segT);
    }
    if (localT >= 0.135 && localT <= 0.139) {
      float segT = (localT - 0.135) / 0.004;
      return mix(vec2(0.162, 0.150), vec2(0.168, 0.153), segT);
    }
    if (localT >= 0.139 && localT <= 0.143) {
      float segT = (localT - 0.139) / 0.004;
      return mix(vec2(0.168, 0.153), vec2(0.172, 0.153), segT);
    }
    if (localT >= 0.143 && localT <= 0.148) {
      float segT = (localT - 0.143) / 0.004;
      return mix(vec2(0.172, 0.153), vec2(0.175, 0.153), segT);
    }
    if (localT >= 0.148 && localT <= 0.152) {
      float segT = (localT - 0.148) / 0.004;
      return mix(vec2(0.175, 0.153), vec2(0.185, 0.157), segT);
    }
    if (localT >= 0.152 && localT <= 0.156) {
      float segT = (localT - 0.152) / 0.004;
      return mix(vec2(0.185, 0.157), vec2(0.192, 0.157), segT);
    }
    if (localT >= 0.156 && localT <= 0.160) {
      float segT = (localT - 0.156) / 0.004;
      return mix(vec2(0.192, 0.157), vec2(0.198, 0.157), segT);
    }
    if (localT >= 0.160 && localT <= 0.164) {
      float segT = (localT - 0.160) / 0.004;
      return mix(vec2(0.198, 0.157), vec2(0.205, 0.157), segT);
    }
    if (localT >= 0.164 && localT <= 0.168) {
      float segT = (localT - 0.164) / 0.004;
      return mix(vec2(0.205, 0.157), vec2(0.208, 0.157), segT);
    }
    if (localT >= 0.168 && localT <= 0.172) {
      float segT = (localT - 0.168) / 0.004;
      return mix(vec2(0.208, 0.157), vec2(0.212, 0.157), segT);
    }
    if (localT >= 0.172 && localT <= 0.176) {
      float segT = (localT - 0.172) / 0.004;
      return mix(vec2(0.212, 0.157), vec2(0.215, 0.157), segT);
    }
    if (localT >= 0.176 && localT <= 0.180) {
      float segT = (localT - 0.176) / 0.004;
      return mix(vec2(0.215, 0.157), vec2(0.222, 0.157), segT);
    }
    if (localT >= 0.180 && localT <= 0.184) {
      float segT = (localT - 0.180) / 0.004;
      return mix(vec2(0.222, 0.157), vec2(0.225, 0.157), segT);
    }
    if (localT >= 0.184 && localT <= 0.189) {
      float segT = (localT - 0.184) / 0.004;
      return mix(vec2(0.225, 0.157), vec2(0.228, 0.157), segT);
    }
    if (localT >= 0.189 && localT <= 0.193) {
      float segT = (localT - 0.189) / 0.004;
      return mix(vec2(0.228, 0.157), vec2(0.235, 0.157), segT);
    }
    if (localT >= 0.193 && localT <= 0.197) {
      float segT = (localT - 0.193) / 0.004;
      return mix(vec2(0.235, 0.157), vec2(0.238, 0.157), segT);
    }
    if (localT >= 0.197 && localT <= 0.201) {
      float segT = (localT - 0.197) / 0.004;
      return mix(vec2(0.238, 0.157), vec2(0.245, 0.160), segT);
    }
    if (localT >= 0.201 && localT <= 0.205) {
      float segT = (localT - 0.201) / 0.004;
      return mix(vec2(0.245, 0.160), vec2(0.252, 0.160), segT);
    }
    if (localT >= 0.205 && localT <= 0.209) {
      float segT = (localT - 0.205) / 0.004;
      return mix(vec2(0.252, 0.160), vec2(0.258, 0.163), segT);
    }
    if (localT >= 0.209 && localT <= 0.213) {
      float segT = (localT - 0.209) / 0.004;
      return mix(vec2(0.258, 0.163), vec2(0.262, 0.163), segT);
    }
    if (localT >= 0.213 && localT <= 0.217) {
      float segT = (localT - 0.213) / 0.004;
      return mix(vec2(0.262, 0.163), vec2(0.265, 0.163), segT);
    }
    if (localT >= 0.217 && localT <= 0.221) {
      float segT = (localT - 0.217) / 0.004;
      return mix(vec2(0.265, 0.163), vec2(0.272, 0.163), segT);
    }
    if (localT >= 0.221 && localT <= 0.225) {
      float segT = (localT - 0.221) / 0.004;
      return mix(vec2(0.272, 0.163), vec2(0.278, 0.163), segT);
    }
    if (localT >= 0.225 && localT <= 0.230) {
      float segT = (localT - 0.225) / 0.004;
      return mix(vec2(0.278, 0.163), vec2(0.285, 0.163), segT);
    }
    if (localT >= 0.230 && localT <= 0.234) {
      float segT = (localT - 0.230) / 0.004;
      return mix(vec2(0.285, 0.163), vec2(0.295, 0.167), segT);
    }
    if (localT >= 0.234 && localT <= 0.238) {
      float segT = (localT - 0.234) / 0.004;
      return mix(vec2(0.295, 0.167), vec2(0.298, 0.167), segT);
    }
    if (localT >= 0.238 && localT <= 0.242) {
      float segT = (localT - 0.238) / 0.004;
      return mix(vec2(0.298, 0.167), vec2(0.302, 0.167), segT);
    }
    if (localT >= 0.242 && localT <= 0.246) {
      float segT = (localT - 0.242) / 0.004;
      return mix(vec2(0.302, 0.167), vec2(0.308, 0.170), segT);
    }
    if (localT >= 0.246 && localT <= 0.250) {
      float segT = (localT - 0.246) / 0.004;
      return mix(vec2(0.308, 0.170), vec2(0.312, 0.170), segT);
    }
    if (localT >= 0.250 && localT <= 0.254) {
      float segT = (localT - 0.250) / 0.004;
      return mix(vec2(0.312, 0.170), vec2(0.315, 0.170), segT);
    }
    if (localT >= 0.254 && localT <= 0.258) {
      float segT = (localT - 0.254) / 0.004;
      return mix(vec2(0.315, 0.170), vec2(0.318, 0.170), segT);
    }
    if (localT >= 0.258 && localT <= 0.262) {
      float segT = (localT - 0.258) / 0.004;
      return mix(vec2(0.318, 0.170), vec2(0.322, 0.170), segT);
    }
    if (localT >= 0.262 && localT <= 0.266) {
      float segT = (localT - 0.262) / 0.004;
      return mix(vec2(0.322, 0.170), vec2(0.325, 0.170), segT);
    }
    if (localT >= 0.266 && localT <= 0.270) {
      float segT = (localT - 0.266) / 0.004;
      return mix(vec2(0.325, 0.170), vec2(0.328, 0.170), segT);
    }
    if (localT >= 0.270 && localT <= 0.275) {
      float segT = (localT - 0.270) / 0.004;
      return mix(vec2(0.328, 0.170), vec2(0.332, 0.170), segT);
    }
    if (localT >= 0.275 && localT <= 0.279) {
      float segT = (localT - 0.275) / 0.004;
      return mix(vec2(0.332, 0.170), vec2(0.335, 0.173), segT);
    }
    if (localT >= 0.279 && localT <= 0.283) {
      float segT = (localT - 0.279) / 0.004;
      return mix(vec2(0.335, 0.173), vec2(0.338, 0.173), segT);
    }
    if (localT >= 0.283 && localT <= 0.287) {
      float segT = (localT - 0.283) / 0.004;
      return mix(vec2(0.338, 0.173), vec2(0.342, 0.173), segT);
    }
    if (localT >= 0.287 && localT <= 0.291) {
      float segT = (localT - 0.287) / 0.004;
      return mix(vec2(0.342, 0.173), vec2(0.345, 0.173), segT);
    }
    if (localT >= 0.291 && localT <= 0.295) {
      float segT = (localT - 0.291) / 0.004;
      return mix(vec2(0.345, 0.173), vec2(0.348, 0.173), segT);
    }
    if (localT >= 0.295 && localT <= 0.299) {
      float segT = (localT - 0.295) / 0.004;
      return mix(vec2(0.348, 0.173), vec2(0.352, 0.173), segT);
    }
    if (localT >= 0.299 && localT <= 0.303) {
      float segT = (localT - 0.299) / 0.004;
      return mix(vec2(0.352, 0.173), vec2(0.348, 0.173), segT);
    }
    if (localT >= 0.303 && localT <= 0.307) {
      float segT = (localT - 0.303) / 0.004;
      return mix(vec2(0.348, 0.173), vec2(0.345, 0.173), segT);
    }
    if (localT >= 0.307 && localT <= 0.311) {
      float segT = (localT - 0.307) / 0.004;
      return mix(vec2(0.345, 0.173), vec2(0.342, 0.173), segT);
    }
    if (localT >= 0.311 && localT <= 0.316) {
      float segT = (localT - 0.311) / 0.004;
      return mix(vec2(0.342, 0.173), vec2(0.332, 0.170), segT);
    }
    if (localT >= 0.316 && localT <= 0.320) {
      float segT = (localT - 0.316) / 0.004;
      return mix(vec2(0.332, 0.170), vec2(0.328, 0.170), segT);
    }
    if (localT >= 0.320 && localT <= 0.324) {
      float segT = (localT - 0.320) / 0.004;
      return mix(vec2(0.328, 0.170), vec2(0.325, 0.170), segT);
    }
    if (localT >= 0.324 && localT <= 0.328) {
      float segT = (localT - 0.324) / 0.004;
      return mix(vec2(0.325, 0.170), vec2(0.318, 0.167), segT);
    }
    if (localT >= 0.328 && localT <= 0.332) {
      float segT = (localT - 0.328) / 0.004;
      return mix(vec2(0.318, 0.167), vec2(0.315, 0.167), segT);
    }
    if (localT >= 0.332 && localT <= 0.336) {
      float segT = (localT - 0.332) / 0.004;
      return mix(vec2(0.315, 0.167), vec2(0.308, 0.163), segT);
    }
    if (localT >= 0.336 && localT <= 0.340) {
      float segT = (localT - 0.336) / 0.004;
      return mix(vec2(0.308, 0.163), vec2(0.305, 0.163), segT);
    }
    if (localT >= 0.340 && localT <= 0.344) {
      float segT = (localT - 0.340) / 0.004;
      return mix(vec2(0.305, 0.163), vec2(0.302, 0.163), segT);
    }
    if (localT >= 0.344 && localT <= 0.348) {
      float segT = (localT - 0.344) / 0.004;
      return mix(vec2(0.302, 0.163), vec2(0.298, 0.163), segT);
    }
    if (localT >= 0.348 && localT <= 0.352) {
      float segT = (localT - 0.348) / 0.004;
      return mix(vec2(0.298, 0.163), vec2(0.295, 0.163), segT);
    }
    if (localT >= 0.352 && localT <= 0.357) {
      float segT = (localT - 0.352) / 0.004;
      return mix(vec2(0.295, 0.163), vec2(0.285, 0.160), segT);
    }
    if (localT >= 0.357 && localT <= 0.361) {
      float segT = (localT - 0.357) / 0.004;
      return mix(vec2(0.285, 0.160), vec2(0.282, 0.160), segT);
    }
    if (localT >= 0.361 && localT <= 0.365) {
      float segT = (localT - 0.361) / 0.004;
      return mix(vec2(0.282, 0.160), vec2(0.278, 0.160), segT);
    }
    if (localT >= 0.365 && localT <= 0.369) {
      float segT = (localT - 0.365) / 0.004;
      return mix(vec2(0.278, 0.160), vec2(0.272, 0.157), segT);
    }
    if (localT >= 0.369 && localT <= 0.373) {
      float segT = (localT - 0.369) / 0.004;
      return mix(vec2(0.272, 0.157), vec2(0.268, 0.157), segT);
    }
    if (localT >= 0.373 && localT <= 0.377) {
      float segT = (localT - 0.373) / 0.004;
      return mix(vec2(0.268, 0.157), vec2(0.265, 0.157), segT);
    }
    if (localT >= 0.377 && localT <= 0.381) {
      float segT = (localT - 0.377) / 0.004;
      return mix(vec2(0.265, 0.157), vec2(0.262, 0.157), segT);
    }
    if (localT >= 0.381 && localT <= 0.385) {
      float segT = (localT - 0.381) / 0.004;
      return mix(vec2(0.262, 0.157), vec2(0.262, 0.153), segT);
    }
    if (localT >= 0.385 && localT <= 0.389) {
      float segT = (localT - 0.385) / 0.004;
      return mix(vec2(0.262, 0.153), vec2(0.258, 0.153), segT);
    }
    if (localT >= 0.389 && localT <= 0.393) {
      float segT = (localT - 0.389) / 0.004;
      return mix(vec2(0.258, 0.153), vec2(0.255, 0.153), segT);
    }
    if (localT >= 0.393 && localT <= 0.398) {
      float segT = (localT - 0.393) / 0.004;
      return mix(vec2(0.255, 0.153), vec2(0.252, 0.153), segT);
    }
    if (localT >= 0.398 && localT <= 0.402) {
      float segT = (localT - 0.398) / 0.004;
      return mix(vec2(0.252, 0.153), vec2(0.248, 0.153), segT);
    }
    if (localT >= 0.402 && localT <= 0.406) {
      float segT = (localT - 0.402) / 0.004;
      return mix(vec2(0.248, 0.153), vec2(0.245, 0.150), segT);
    }
    if (localT >= 0.406 && localT <= 0.410) {
      float segT = (localT - 0.406) / 0.004;
      return mix(vec2(0.245, 0.150), vec2(0.242, 0.150), segT);
    }
    if (localT >= 0.410 && localT <= 0.414) {
      float segT = (localT - 0.410) / 0.004;
      return mix(vec2(0.242, 0.150), vec2(0.238, 0.150), segT);
    }
    if (localT >= 0.414 && localT <= 0.418) {
      float segT = (localT - 0.414) / 0.004;
      return mix(vec2(0.238, 0.150), vec2(0.235, 0.147), segT);
    }
    if (localT >= 0.418 && localT <= 0.422) {
      float segT = (localT - 0.418) / 0.004;
      return mix(vec2(0.235, 0.147), vec2(0.232, 0.140), segT);
    }
    if (localT >= 0.422 && localT <= 0.426) {
      float segT = (localT - 0.422) / 0.004;
      return mix(vec2(0.232, 0.140), vec2(0.232, 0.133), segT);
    }
    if (localT >= 0.426 && localT <= 0.430) {
      float segT = (localT - 0.426) / 0.004;
      return mix(vec2(0.232, 0.133), vec2(0.232, 0.130), segT);
    }
    if (localT >= 0.430 && localT <= 0.434) {
      float segT = (localT - 0.430) / 0.004;
      return mix(vec2(0.232, 0.130), vec2(0.232, 0.123), segT);
    }
    if (localT >= 0.434 && localT <= 0.439) {
      float segT = (localT - 0.434) / 0.004;
      return mix(vec2(0.232, 0.123), vec2(0.232, 0.120), segT);
    }
    if (localT >= 0.439 && localT <= 0.443) {
      float segT = (localT - 0.439) / 0.004;
      return mix(vec2(0.232, 0.120), vec2(0.232, 0.117), segT);
    }
    if (localT >= 0.443 && localT <= 0.447) {
      float segT = (localT - 0.443) / 0.004;
      return mix(vec2(0.232, 0.117), vec2(0.232, 0.113), segT);
    }
    if (localT >= 0.447 && localT <= 0.451) {
      float segT = (localT - 0.447) / 0.004;
      return mix(vec2(0.232, 0.113), vec2(0.232, 0.103), segT);
    }
    if (localT >= 0.451 && localT <= 0.455) {
      float segT = (localT - 0.451) / 0.004;
      return mix(vec2(0.232, 0.103), vec2(0.232, 0.100), segT);
    }
    if (localT >= 0.455 && localT <= 0.459) {
      float segT = (localT - 0.455) / 0.004;
      return mix(vec2(0.232, 0.100), vec2(0.232, 0.093), segT);
    }
    if (localT >= 0.459 && localT <= 0.463) {
      float segT = (localT - 0.459) / 0.004;
      return mix(vec2(0.232, 0.093), vec2(0.232, 0.090), segT);
    }
    if (localT >= 0.463 && localT <= 0.467) {
      float segT = (localT - 0.463) / 0.004;
      return mix(vec2(0.232, 0.090), vec2(0.232, 0.083), segT);
    }
    if (localT >= 0.467 && localT <= 0.471) {
      float segT = (localT - 0.467) / 0.004;
      return mix(vec2(0.232, 0.083), vec2(0.232, 0.080), segT);
    }
    if (localT >= 0.471 && localT <= 0.475) {
      float segT = (localT - 0.471) / 0.004;
      return mix(vec2(0.232, 0.080), vec2(0.232, 0.077), segT);
    }
    if (localT >= 0.475 && localT <= 0.480) {
      float segT = (localT - 0.475) / 0.004;
      return mix(vec2(0.232, 0.077), vec2(0.232, 0.067), segT);
    }
    if (localT >= 0.480 && localT <= 0.484) {
      float segT = (localT - 0.480) / 0.004;
      return mix(vec2(0.232, 0.067), vec2(0.232, 0.063), segT);
    }
    if (localT >= 0.484 && localT <= 0.488) {
      float segT = (localT - 0.484) / 0.004;
      return mix(vec2(0.232, 0.063), vec2(0.232, 0.060), segT);
    }
    if (localT >= 0.488 && localT <= 0.492) {
      float segT = (localT - 0.488) / 0.004;
      return mix(vec2(0.232, 0.060), vec2(0.232, 0.057), segT);
    }
    if (localT >= 0.492 && localT <= 0.496) {
      float segT = (localT - 0.492) / 0.004;
      return mix(vec2(0.232, 0.057), vec2(0.232, 0.050), segT);
    }
    if (localT >= 0.496 && localT <= 0.500) {
      float segT = (localT - 0.496) / 0.004;
      return mix(vec2(0.232, 0.050), vec2(0.232, 0.047), segT);
    }
    if (localT >= 0.500 && localT <= 0.504) {
      float segT = (localT - 0.500) / 0.004;
      return mix(vec2(0.232, 0.047), vec2(0.232, 0.043), segT);
    }
    if (localT >= 0.504 && localT <= 0.508) {
      float segT = (localT - 0.504) / 0.004;
      return mix(vec2(0.232, 0.043), vec2(0.235, 0.040), segT);
    }
    if (localT >= 0.508 && localT <= 0.512) {
      float segT = (localT - 0.508) / 0.004;
      return mix(vec2(0.235, 0.040), vec2(0.235, 0.037), segT);
    }
    if (localT >= 0.512 && localT <= 0.516) {
      float segT = (localT - 0.512) / 0.004;
      return mix(vec2(0.235, 0.037), vec2(0.238, 0.033), segT);
    }
    if (localT >= 0.516 && localT <= 0.520) {
      float segT = (localT - 0.516) / 0.004;
      return mix(vec2(0.238, 0.033), vec2(0.238, 0.030), segT);
    }
    if (localT >= 0.520 && localT <= 0.525) {
      float segT = (localT - 0.520) / 0.004;
      return mix(vec2(0.238, 0.030), vec2(0.242, 0.027), segT);
    }
    if (localT >= 0.525 && localT <= 0.529) {
      float segT = (localT - 0.525) / 0.004;
      return mix(vec2(0.242, 0.027), vec2(0.242, 0.023), segT);
    }
    if (localT >= 0.529 && localT <= 0.533) {
      float segT = (localT - 0.529) / 0.004;
      return mix(vec2(0.242, 0.023), vec2(0.242, 0.020), segT);
    }
    if (localT >= 0.533 && localT <= 0.537) {
      float segT = (localT - 0.533) / 0.004;
      return mix(vec2(0.242, 0.020), vec2(0.245, 0.017), segT);
    }
    if (localT >= 0.537 && localT <= 0.541) {
      float segT = (localT - 0.537) / 0.004;
      return mix(vec2(0.245, 0.017), vec2(0.245, 0.013), segT);
    }
    if (localT >= 0.541 && localT <= 0.545) {
      float segT = (localT - 0.541) / 0.004;
      return mix(vec2(0.245, 0.013), vec2(0.245, 0.010), segT);
    }
    if (localT >= 0.545 && localT <= 0.549) {
      float segT = (localT - 0.545) / 0.004;
      return mix(vec2(0.245, 0.010), vec2(0.245, 0.007), segT);
    }
    if (localT >= 0.549 && localT <= 0.553) {
      float segT = (localT - 0.549) / 0.004;
      return mix(vec2(0.245, 0.007), vec2(0.248, 0.003), segT);
    }
    if (localT >= 0.553 && localT <= 0.557) {
      float segT = (localT - 0.553) / 0.004;
      return mix(vec2(0.248, 0.003), vec2(0.248, 0.007), segT);
    }
    if (localT >= 0.557 && localT <= 0.561) {
      float segT = (localT - 0.557) / 0.004;
      return mix(vec2(0.248, 0.007), vec2(0.248, 0.010), segT);
    }
    if (localT >= 0.561 && localT <= 0.566) {
      float segT = (localT - 0.561) / 0.004;
      return mix(vec2(0.248, 0.010), vec2(0.245, 0.020), segT);
    }
    if (localT >= 0.566 && localT <= 0.570) {
      float segT = (localT - 0.566) / 0.004;
      return mix(vec2(0.245, 0.020), vec2(0.245, 0.023), segT);
    }
    if (localT >= 0.570 && localT <= 0.574) {
      float segT = (localT - 0.570) / 0.004;
      return mix(vec2(0.245, 0.023), vec2(0.245, 0.033), segT);
    }
    if (localT >= 0.574 && localT <= 0.578) {
      float segT = (localT - 0.574) / 0.004;
      return mix(vec2(0.245, 0.033), vec2(0.242, 0.037), segT);
    }
    if (localT >= 0.578 && localT <= 0.582) {
      float segT = (localT - 0.578) / 0.004;
      return mix(vec2(0.242, 0.037), vec2(0.242, 0.043), segT);
    }
    if (localT >= 0.582 && localT <= 0.586) {
      float segT = (localT - 0.582) / 0.004;
      return mix(vec2(0.242, 0.043), vec2(0.242, 0.050), segT);
    }
    if (localT >= 0.586 && localT <= 0.590) {
      float segT = (localT - 0.586) / 0.004;
      return mix(vec2(0.242, 0.050), vec2(0.238, 0.057), segT);
    }
    if (localT >= 0.590 && localT <= 0.594) {
      float segT = (localT - 0.590) / 0.004;
      return mix(vec2(0.238, 0.057), vec2(0.235, 0.067), segT);
    }
    if (localT >= 0.594 && localT <= 0.598) {
      float segT = (localT - 0.594) / 0.004;
      return mix(vec2(0.235, 0.067), vec2(0.235, 0.073), segT);
    }
    if (localT >= 0.598 && localT <= 0.602) {
      float segT = (localT - 0.598) / 0.004;
      return mix(vec2(0.235, 0.073), vec2(0.235, 0.080), segT);
    }
    if (localT >= 0.602 && localT <= 0.607) {
      float segT = (localT - 0.602) / 0.004;
      return mix(vec2(0.235, 0.080), vec2(0.232, 0.087), segT);
    }
    if (localT >= 0.607 && localT <= 0.611) {
      float segT = (localT - 0.607) / 0.004;
      return mix(vec2(0.232, 0.087), vec2(0.232, 0.093), segT);
    }
    if (localT >= 0.611 && localT <= 0.615) {
      float segT = (localT - 0.611) / 0.004;
      return mix(vec2(0.232, 0.093), vec2(0.228, 0.097), segT);
    }
    if (localT >= 0.615 && localT <= 0.619) {
      float segT = (localT - 0.615) / 0.004;
      return mix(vec2(0.228, 0.097), vec2(0.228, 0.103), segT);
    }
    if (localT >= 0.619 && localT <= 0.623) {
      float segT = (localT - 0.619) / 0.004;
      return mix(vec2(0.228, 0.103), vec2(0.228, 0.107), segT);
    }
    if (localT >= 0.623 && localT <= 0.627) {
      float segT = (localT - 0.623) / 0.004;
      return mix(vec2(0.228, 0.107), vec2(0.228, 0.110), segT);
    }
    if (localT >= 0.627 && localT <= 0.631) {
      float segT = (localT - 0.627) / 0.004;
      return mix(vec2(0.228, 0.110), vec2(0.228, 0.113), segT);
    }
    if (localT >= 0.631 && localT <= 0.635) {
      float segT = (localT - 0.631) / 0.004;
      return mix(vec2(0.228, 0.113), vec2(0.222, 0.127), segT);
    }
    if (localT >= 0.635 && localT <= 0.639) {
      float segT = (localT - 0.635) / 0.004;
      return mix(vec2(0.222, 0.127), vec2(0.222, 0.130), segT);
    }
    if (localT >= 0.639 && localT <= 0.643) {
      float segT = (localT - 0.639) / 0.004;
      return mix(vec2(0.222, 0.130), vec2(0.218, 0.140), segT);
    }
    if (localT >= 0.643 && localT <= 0.648) {
      float segT = (localT - 0.643) / 0.004;
      return mix(vec2(0.218, 0.140), vec2(0.218, 0.143), segT);
    }
    if (localT >= 0.648 && localT <= 0.652) {
      float segT = (localT - 0.648) / 0.004;
      return mix(vec2(0.218, 0.143), vec2(0.215, 0.147), segT);
    }
    if (localT >= 0.652 && localT <= 0.656) {
      float segT = (localT - 0.652) / 0.004;
      return mix(vec2(0.215, 0.147), vec2(0.215, 0.157), segT);
    }
    if (localT >= 0.656 && localT <= 0.660) {
      float segT = (localT - 0.656) / 0.004;
      return mix(vec2(0.215, 0.157), vec2(0.212, 0.163), segT);
    }
    if (localT >= 0.660 && localT <= 0.664) {
      float segT = (localT - 0.660) / 0.004;
      return mix(vec2(0.212, 0.163), vec2(0.208, 0.170), segT);
    }
    if (localT >= 0.664 && localT <= 0.668) {
      float segT = (localT - 0.664) / 0.004;
      return mix(vec2(0.208, 0.170), vec2(0.208, 0.173), segT);
    }
    if (localT >= 0.668 && localT <= 0.672) {
      float segT = (localT - 0.668) / 0.004;
      return mix(vec2(0.208, 0.173), vec2(0.208, 0.177), segT);
    }
    if (localT >= 0.672 && localT <= 0.676) {
      float segT = (localT - 0.672) / 0.004;
      return mix(vec2(0.208, 0.177), vec2(0.208, 0.180), segT);
    }
    if (localT >= 0.676 && localT <= 0.680) {
      float segT = (localT - 0.676) / 0.004;
      return mix(vec2(0.208, 0.180), vec2(0.202, 0.193), segT);
    }
    if (localT >= 0.680 && localT <= 0.684) {
      float segT = (localT - 0.680) / 0.004;
      return mix(vec2(0.202, 0.193), vec2(0.202, 0.197), segT);
    }
    if (localT >= 0.684 && localT <= 0.689) {
      float segT = (localT - 0.684) / 0.004;
      return mix(vec2(0.202, 0.197), vec2(0.198, 0.200), segT);
    }
    if (localT >= 0.689 && localT <= 0.693) {
      float segT = (localT - 0.689) / 0.004;
      return mix(vec2(0.198, 0.200), vec2(0.195, 0.210), segT);
    }
    if (localT >= 0.693 && localT <= 0.697) {
      float segT = (localT - 0.693) / 0.004;
      return mix(vec2(0.195, 0.210), vec2(0.195, 0.213), segT);
    }
    if (localT >= 0.697 && localT <= 0.701) {
      float segT = (localT - 0.697) / 0.004;
      return mix(vec2(0.195, 0.213), vec2(0.192, 0.223), segT);
    }
    if (localT >= 0.701 && localT <= 0.705) {
      float segT = (localT - 0.701) / 0.004;
      return mix(vec2(0.192, 0.223), vec2(0.188, 0.227), segT);
    }
    if (localT >= 0.705 && localT <= 0.709) {
      float segT = (localT - 0.705) / 0.004;
      return mix(vec2(0.188, 0.227), vec2(0.188, 0.233), segT);
    }
    if (localT >= 0.709 && localT <= 0.713) {
      float segT = (localT - 0.709) / 0.004;
      return mix(vec2(0.188, 0.233), vec2(0.188, 0.243), segT);
    }
    if (localT >= 0.713 && localT <= 0.717) {
      float segT = (localT - 0.713) / 0.004;
      return mix(vec2(0.188, 0.243), vec2(0.188, 0.247), segT);
    }
    if (localT >= 0.717 && localT <= 0.721) {
      float segT = (localT - 0.717) / 0.004;
      return mix(vec2(0.188, 0.247), vec2(0.188, 0.257), segT);
    }
    if (localT >= 0.721 && localT <= 0.725) {
      float segT = (localT - 0.721) / 0.004;
      return mix(vec2(0.188, 0.257), vec2(0.188, 0.263), segT);
    }
    if (localT >= 0.725 && localT <= 0.730) {
      float segT = (localT - 0.725) / 0.004;
      return mix(vec2(0.188, 0.263), vec2(0.188, 0.267), segT);
    }
    if (localT >= 0.730 && localT <= 0.734) {
      float segT = (localT - 0.730) / 0.004;
      return mix(vec2(0.188, 0.267), vec2(0.188, 0.270), segT);
    }
    if (localT >= 0.734 && localT <= 0.738) {
      float segT = (localT - 0.734) / 0.004;
      return mix(vec2(0.188, 0.270), vec2(0.188, 0.273), segT);
    }
    if (localT >= 0.738 && localT <= 0.742) {
      float segT = (localT - 0.738) / 0.004;
      return mix(vec2(0.188, 0.273), vec2(0.188, 0.283), segT);
    }
    if (localT >= 0.742 && localT <= 0.746) {
      float segT = (localT - 0.742) / 0.004;
      return mix(vec2(0.188, 0.283), vec2(0.188, 0.287), segT);
    }
    if (localT >= 0.746 && localT <= 0.750) {
      float segT = (localT - 0.746) / 0.004;
      return mix(vec2(0.188, 0.287), vec2(0.188, 0.290), segT);
    }
    if (localT >= 0.750 && localT <= 0.754) {
      float segT = (localT - 0.750) / 0.004;
      return mix(vec2(0.188, 0.290), vec2(0.185, 0.300), segT);
    }
    if (localT >= 0.754 && localT <= 0.758) {
      float segT = (localT - 0.754) / 0.004;
      return mix(vec2(0.185, 0.300), vec2(0.185, 0.303), segT);
    }
    if (localT >= 0.758 && localT <= 0.762) {
      float segT = (localT - 0.758) / 0.004;
      return mix(vec2(0.185, 0.303), vec2(0.182, 0.310), segT);
    }
    if (localT >= 0.762 && localT <= 0.766) {
      float segT = (localT - 0.762) / 0.004;
      return mix(vec2(0.182, 0.310), vec2(0.182, 0.313), segT);
    }
    if (localT >= 0.766 && localT <= 0.770) {
      float segT = (localT - 0.766) / 0.004;
      return mix(vec2(0.182, 0.313), vec2(0.178, 0.317), segT);
    }
    if (localT >= 0.770 && localT <= 0.775) {
      float segT = (localT - 0.770) / 0.004;
      return mix(vec2(0.178, 0.317), vec2(0.178, 0.320), segT);
    }
    if (localT >= 0.775 && localT <= 0.779) {
      float segT = (localT - 0.775) / 0.004;
      return mix(vec2(0.178, 0.320), vec2(0.178, 0.323), segT);
    }
    if (localT >= 0.779 && localT <= 0.783) {
      float segT = (localT - 0.779) / 0.004;
      return mix(vec2(0.178, 0.323), vec2(0.175, 0.327), segT);
    }
    if (localT >= 0.783 && localT <= 0.787) {
      float segT = (localT - 0.783) / 0.004;
      return mix(vec2(0.175, 0.327), vec2(0.172, 0.330), segT);
    }
    if (localT >= 0.787 && localT <= 0.791) {
      float segT = (localT - 0.787) / 0.004;
      return mix(vec2(0.172, 0.330), vec2(0.168, 0.333), segT);
    }
    if (localT >= 0.791 && localT <= 0.795) {
      float segT = (localT - 0.791) / 0.004;
      return mix(vec2(0.168, 0.333), vec2(0.165, 0.337), segT);
    }
    if (localT >= 0.795 && localT <= 0.799) {
      float segT = (localT - 0.795) / 0.004;
      return mix(vec2(0.165, 0.337), vec2(0.165, 0.340), segT);
    }
    if (localT >= 0.799 && localT <= 0.803) {
      float segT = (localT - 0.799) / 0.004;
      return mix(vec2(0.165, 0.340), vec2(0.158, 0.343), segT);
    }
    if (localT >= 0.803 && localT <= 0.807) {
      float segT = (localT - 0.803) / 0.004;
      return mix(vec2(0.158, 0.343), vec2(0.155, 0.347), segT);
    }
    if (localT >= 0.807 && localT <= 0.811) {
      float segT = (localT - 0.807) / 0.004;
      return mix(vec2(0.155, 0.347), vec2(0.155, 0.350), segT);
    }
    if (localT >= 0.811 && localT <= 0.816) {
      float segT = (localT - 0.811) / 0.004;
      return mix(vec2(0.155, 0.350), vec2(0.152, 0.350), segT);
    }
    if (localT >= 0.816 && localT <= 0.820) {
      float segT = (localT - 0.816) / 0.004;
      return mix(vec2(0.152, 0.350), vec2(0.145, 0.347), segT);
    }
    if (localT >= 0.820 && localT <= 0.824) {
      float segT = (localT - 0.820) / 0.004;
      return mix(vec2(0.145, 0.347), vec2(0.142, 0.340), segT);
    }
    if (localT >= 0.824 && localT <= 0.828) {
      float segT = (localT - 0.824) / 0.004;
      return mix(vec2(0.142, 0.340), vec2(0.138, 0.337), segT);
    }
    if (localT >= 0.828 && localT <= 0.832) {
      float segT = (localT - 0.828) / 0.004;
      return mix(vec2(0.138, 0.337), vec2(0.128, 0.313), segT);
    }
    if (localT >= 0.832 && localT <= 0.836) {
      float segT = (localT - 0.832) / 0.004;
      return mix(vec2(0.128, 0.313), vec2(0.125, 0.307), segT);
    }
    if (localT >= 0.836 && localT <= 0.840) {
      float segT = (localT - 0.836) / 0.004;
      return mix(vec2(0.125, 0.307), vec2(0.122, 0.293), segT);
    }
    if (localT >= 0.840 && localT <= 0.844) {
      float segT = (localT - 0.840) / 0.004;
      return mix(vec2(0.122, 0.293), vec2(0.122, 0.287), segT);
    }
    if (localT >= 0.844 && localT <= 0.848) {
      float segT = (localT - 0.844) / 0.004;
      return mix(vec2(0.122, 0.287), vec2(0.115, 0.280), segT);
    }
    if (localT >= 0.848 && localT <= 0.852) {
      float segT = (localT - 0.848) / 0.004;
      return mix(vec2(0.115, 0.280), vec2(0.115, 0.270), segT);
    }
    if (localT >= 0.852 && localT <= 0.857) {
      float segT = (localT - 0.852) / 0.004;
      return mix(vec2(0.115, 0.270), vec2(0.115, 0.267), segT);
    }
    if (localT >= 0.857 && localT <= 0.861) {
      float segT = (localT - 0.857) / 0.004;
      return mix(vec2(0.115, 0.267), vec2(0.112, 0.263), segT);
    }
    if (localT >= 0.861 && localT <= 0.865) {
      float segT = (localT - 0.861) / 0.004;
      return mix(vec2(0.112, 0.263), vec2(0.105, 0.233), segT);
    }
    if (localT >= 0.865 && localT <= 0.869) {
      float segT = (localT - 0.865) / 0.004;
      return mix(vec2(0.105, 0.233), vec2(0.102, 0.227), segT);
    }
    if (localT >= 0.869 && localT <= 0.873) {
      float segT = (localT - 0.869) / 0.004;
      return mix(vec2(0.102, 0.227), vec2(0.098, 0.217), segT);
    }
    if (localT >= 0.873 && localT <= 0.877) {
      float segT = (localT - 0.873) / 0.004;
      return mix(vec2(0.098, 0.217), vec2(0.095, 0.197), segT);
    }
    if (localT >= 0.877 && localT <= 0.881) {
      float segT = (localT - 0.877) / 0.004;
      return mix(vec2(0.095, 0.197), vec2(0.092, 0.190), segT);
    }
    if (localT >= 0.881 && localT <= 0.885) {
      float segT = (localT - 0.881) / 0.004;
      return mix(vec2(0.092, 0.190), vec2(0.092, 0.187), segT);
    }
    if (localT >= 0.885 && localT <= 0.889) {
      float segT = (localT - 0.885) / 0.004;
      return mix(vec2(0.092, 0.187), vec2(0.092, 0.183), segT);
    }
    if (localT >= 0.889 && localT <= 0.893) {
      float segT = (localT - 0.889) / 0.004;
      return mix(vec2(0.092, 0.183), vec2(0.092, 0.177), segT);
    }
    if (localT >= 0.893 && localT <= 0.898) {
      float segT = (localT - 0.893) / 0.004;
      return mix(vec2(0.092, 0.177), vec2(0.088, 0.170), segT);
    }
    if (localT >= 0.898 && localT <= 0.902) {
      float segT = (localT - 0.898) / 0.004;
      return mix(vec2(0.088, 0.170), vec2(0.088, 0.167), segT);
    }
    if (localT >= 0.902 && localT <= 0.906) {
      float segT = (localT - 0.902) / 0.004;
      return mix(vec2(0.088, 0.167), vec2(0.085, 0.153), segT);
    }
    if (localT >= 0.906 && localT <= 0.910) {
      float segT = (localT - 0.906) / 0.004;
      return mix(vec2(0.085, 0.153), vec2(0.085, 0.147), segT);
    }
    if (localT >= 0.910 && localT <= 0.914) {
      float segT = (localT - 0.910) / 0.004;
      return mix(vec2(0.085, 0.147), vec2(0.082, 0.140), segT);
    }
    if (localT >= 0.914 && localT <= 0.918) {
      float segT = (localT - 0.914) / 0.004;
      return mix(vec2(0.082, 0.140), vec2(0.082, 0.120), segT);
    }
    if (localT >= 0.918 && localT <= 0.922) {
      float segT = (localT - 0.918) / 0.004;
      return mix(vec2(0.082, 0.120), vec2(0.082, 0.117), segT);
    }
    if (localT >= 0.922 && localT <= 0.926) {
      float segT = (localT - 0.922) / 0.004;
      return mix(vec2(0.082, 0.117), vec2(0.082, 0.110), segT);
    }
    if (localT >= 0.926 && localT <= 0.930) {
      float segT = (localT - 0.926) / 0.004;
      return mix(vec2(0.082, 0.110), vec2(0.082, 0.100), segT);
    }
    if (localT >= 0.930 && localT <= 0.934) {
      float segT = (localT - 0.930) / 0.004;
      return mix(vec2(0.082, 0.100), vec2(0.082, 0.097), segT);
    }
    if (localT >= 0.934 && localT <= 0.939) {
      float segT = (localT - 0.934) / 0.004;
      return mix(vec2(0.082, 0.097), vec2(0.082, 0.090), segT);
    }
    if (localT >= 0.939 && localT <= 0.943) {
      float segT = (localT - 0.939) / 0.004;
      return mix(vec2(0.082, 0.090), vec2(0.082, 0.080), segT);
    }
    if (localT >= 0.943 && localT <= 0.947) {
      float segT = (localT - 0.943) / 0.004;
      return mix(vec2(0.082, 0.080), vec2(0.082, 0.077), segT);
    }
    if (localT >= 0.947 && localT <= 0.951) {
      float segT = (localT - 0.947) / 0.004;
      return mix(vec2(0.082, 0.077), vec2(0.082, 0.067), segT);
    }
    if (localT >= 0.951 && localT <= 0.955) {
      float segT = (localT - 0.951) / 0.004;
      return mix(vec2(0.082, 0.067), vec2(0.078, 0.053), segT);
    }
    if (localT >= 0.955 && localT <= 0.959) {
      float segT = (localT - 0.955) / 0.004;
      return mix(vec2(0.078, 0.053), vec2(0.075, 0.047), segT);
    }
    if (localT >= 0.959 && localT <= 0.963) {
      float segT = (localT - 0.959) / 0.004;
      return mix(vec2(0.075, 0.047), vec2(0.075, 0.043), segT);
    }
    if (localT >= 0.963 && localT <= 0.967) {
      float segT = (localT - 0.963) / 0.004;
      return mix(vec2(0.075, 0.043), vec2(0.075, 0.040), segT);
    }
    if (localT >= 0.967 && localT <= 0.971) {
      float segT = (localT - 0.967) / 0.004;
      return mix(vec2(0.075, 0.040), vec2(0.075, 0.037), segT);
    }
    if (localT >= 0.971 && localT <= 0.975) {
      float segT = (localT - 0.971) / 0.004;
      return mix(vec2(0.075, 0.037), vec2(0.072, 0.033), segT);
    }
    if (localT >= 0.975 && localT <= 0.980) {
      float segT = (localT - 0.975) / 0.004;
      return mix(vec2(0.072, 0.033), vec2(0.072, 0.030), segT);
    }
    if (localT >= 0.980 && localT <= 0.984) {
      float segT = (localT - 0.980) / 0.004;
      return mix(vec2(0.072, 0.030), vec2(0.068, 0.030), segT);
    }
    if (localT >= 0.984 && localT <= 0.988) {
      float segT = (localT - 0.984) / 0.004;
      return mix(vec2(0.068, 0.030), vec2(0.065, 0.023), segT);
    }
    if (localT >= 0.988 && localT <= 0.992) {
      float segT = (localT - 0.988) / 0.004;
      return mix(vec2(0.065, 0.023), vec2(0.058, 0.017), segT);
    }
    if (localT >= 0.992 && localT <= 0.996) {
      float segT = (localT - 0.992) / 0.004;
      return mix(vec2(0.058, 0.017), vec2(0.055, 0.017), segT);
    }
    if (localT >= 0.996 && localT <= 1.000) {
      float segT = (localT - 0.996) / 0.004;
      return mix(vec2(0.055, 0.017), vec2(0.052, 0.013), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 4) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.013) {
      float segT = (localT - 0.000) / 0.013;
      return mix(vec2(-0.365, 0.133), vec2(-0.368, 0.133), segT);
    }
    if (localT >= 0.013 && localT <= 0.026) {
      float segT = (localT - 0.013) / 0.013;
      return mix(vec2(-0.368, 0.133), vec2(-0.372, 0.130), segT);
    }
    if (localT >= 0.026 && localT <= 0.039) {
      float segT = (localT - 0.026) / 0.013;
      return mix(vec2(-0.372, 0.130), vec2(-0.372, 0.127), segT);
    }
    if (localT >= 0.039 && localT <= 0.053) {
      float segT = (localT - 0.039) / 0.013;
      return mix(vec2(-0.372, 0.127), vec2(-0.372, 0.120), segT);
    }
    if (localT >= 0.053 && localT <= 0.066) {
      float segT = (localT - 0.053) / 0.013;
      return mix(vec2(-0.372, 0.120), vec2(-0.372, 0.107), segT);
    }
    if (localT >= 0.066 && localT <= 0.079) {
      float segT = (localT - 0.066) / 0.013;
      return mix(vec2(-0.372, 0.107), vec2(-0.372, 0.100), segT);
    }
    if (localT >= 0.079 && localT <= 0.092) {
      float segT = (localT - 0.079) / 0.013;
      return mix(vec2(-0.372, 0.100), vec2(-0.372, 0.090), segT);
    }
    if (localT >= 0.092 && localT <= 0.105) {
      float segT = (localT - 0.092) / 0.013;
      return mix(vec2(-0.372, 0.090), vec2(-0.372, 0.057), segT);
    }
    if (localT >= 0.105 && localT <= 0.118) {
      float segT = (localT - 0.105) / 0.013;
      return mix(vec2(-0.372, 0.057), vec2(-0.372, 0.047), segT);
    }
    if (localT >= 0.118 && localT <= 0.132) {
      float segT = (localT - 0.118) / 0.013;
      return mix(vec2(-0.372, 0.047), vec2(-0.372, 0.040), segT);
    }
    if (localT >= 0.132 && localT <= 0.145) {
      float segT = (localT - 0.132) / 0.013;
      return mix(vec2(-0.372, 0.040), vec2(-0.365, 0.013), segT);
    }
    if (localT >= 0.145 && localT <= 0.158) {
      float segT = (localT - 0.145) / 0.013;
      return mix(vec2(-0.365, 0.013), vec2(-0.362, 0.003), segT);
    }
    if (localT >= 0.158 && localT <= 0.171) {
      float segT = (localT - 0.158) / 0.013;
      return mix(vec2(-0.362, 0.003), vec2(-0.362, -0.027), segT);
    }
    if (localT >= 0.171 && localT <= 0.184) {
      float segT = (localT - 0.171) / 0.013;
      return mix(vec2(-0.362, -0.027), vec2(-0.358, -0.037), segT);
    }
    if (localT >= 0.184 && localT <= 0.197) {
      float segT = (localT - 0.184) / 0.013;
      return mix(vec2(-0.358, -0.037), vec2(-0.355, -0.063), segT);
    }
    if (localT >= 0.197 && localT <= 0.211) {
      float segT = (localT - 0.197) / 0.013;
      return mix(vec2(-0.355, -0.063), vec2(-0.352, -0.073), segT);
    }
    if (localT >= 0.211 && localT <= 0.224) {
      float segT = (localT - 0.211) / 0.013;
      return mix(vec2(-0.352, -0.073), vec2(-0.352, -0.083), segT);
    }
    if (localT >= 0.224 && localT <= 0.237) {
      float segT = (localT - 0.224) / 0.013;
      return mix(vec2(-0.352, -0.083), vec2(-0.352, -0.090), segT);
    }
    if (localT >= 0.237 && localT <= 0.250) {
      float segT = (localT - 0.237) / 0.013;
      return mix(vec2(-0.352, -0.090), vec2(-0.348, -0.110), segT);
    }
    if (localT >= 0.250 && localT <= 0.263) {
      float segT = (localT - 0.250) / 0.013;
      return mix(vec2(-0.348, -0.110), vec2(-0.348, -0.117), segT);
    }
    if (localT >= 0.263 && localT <= 0.276) {
      float segT = (localT - 0.263) / 0.013;
      return mix(vec2(-0.348, -0.117), vec2(-0.348, -0.133), segT);
    }
    if (localT >= 0.276 && localT <= 0.289) {
      float segT = (localT - 0.276) / 0.013;
      return mix(vec2(-0.348, -0.133), vec2(-0.348, -0.140), segT);
    }
    if (localT >= 0.289 && localT <= 0.303) {
      float segT = (localT - 0.289) / 0.013;
      return mix(vec2(-0.348, -0.140), vec2(-0.348, -0.147), segT);
    }
    if (localT >= 0.303 && localT <= 0.316) {
      float segT = (localT - 0.303) / 0.013;
      return mix(vec2(-0.348, -0.147), vec2(-0.348, -0.163), segT);
    }
    if (localT >= 0.316 && localT <= 0.329) {
      float segT = (localT - 0.316) / 0.013;
      return mix(vec2(-0.348, -0.163), vec2(-0.348, -0.170), segT);
    }
    if (localT >= 0.329 && localT <= 0.342) {
      float segT = (localT - 0.329) / 0.013;
      return mix(vec2(-0.348, -0.170), vec2(-0.348, -0.183), segT);
    }
    if (localT >= 0.342 && localT <= 0.355) {
      float segT = (localT - 0.342) / 0.013;
      return mix(vec2(-0.348, -0.183), vec2(-0.348, -0.187), segT);
    }
    if (localT >= 0.355 && localT <= 0.368) {
      float segT = (localT - 0.355) / 0.013;
      return mix(vec2(-0.348, -0.187), vec2(-0.352, -0.200), segT);
    }
    if (localT >= 0.368 && localT <= 0.382) {
      float segT = (localT - 0.368) / 0.013;
      return mix(vec2(-0.352, -0.200), vec2(-0.352, -0.203), segT);
    }
    if (localT >= 0.382 && localT <= 0.395) {
      float segT = (localT - 0.382) / 0.013;
      return mix(vec2(-0.352, -0.203), vec2(-0.358, -0.220), segT);
    }
    if (localT >= 0.395 && localT <= 0.408) {
      float segT = (localT - 0.395) / 0.013;
      return mix(vec2(-0.358, -0.220), vec2(-0.358, -0.223), segT);
    }
    if (localT >= 0.408 && localT <= 0.421) {
      float segT = (localT - 0.408) / 0.013;
      return mix(vec2(-0.358, -0.223), vec2(-0.362, -0.230), segT);
    }
    if (localT >= 0.421 && localT <= 0.434) {
      float segT = (localT - 0.421) / 0.013;
      return mix(vec2(-0.362, -0.230), vec2(-0.362, -0.233), segT);
    }
    if (localT >= 0.434 && localT <= 0.447) {
      float segT = (localT - 0.434) / 0.013;
      return mix(vec2(-0.362, -0.233), vec2(-0.362, -0.237), segT);
    }
    if (localT >= 0.447 && localT <= 0.461) {
      float segT = (localT - 0.447) / 0.013;
      return mix(vec2(-0.362, -0.237), vec2(-0.362, -0.240), segT);
    }
    if (localT >= 0.461 && localT <= 0.474) {
      float segT = (localT - 0.461) / 0.013;
      return mix(vec2(-0.362, -0.240), vec2(-0.365, -0.243), segT);
    }
    if (localT >= 0.474 && localT <= 0.487) {
      float segT = (localT - 0.474) / 0.013;
      return mix(vec2(-0.365, -0.243), vec2(-0.365, -0.247), segT);
    }
    if (localT >= 0.487 && localT <= 0.500) {
      float segT = (localT - 0.487) / 0.013;
      return mix(vec2(-0.365, -0.247), vec2(-0.365, -0.250), segT);
    }
    if (localT >= 0.500 && localT <= 0.513) {
      float segT = (localT - 0.500) / 0.013;
      return mix(vec2(-0.365, -0.250), vec2(-0.368, -0.250), segT);
    }
    if (localT >= 0.513 && localT <= 0.526) {
      float segT = (localT - 0.513) / 0.013;
      return mix(vec2(-0.368, -0.250), vec2(-0.372, -0.250), segT);
    }
    if (localT >= 0.526 && localT <= 0.539) {
      float segT = (localT - 0.526) / 0.013;
      return mix(vec2(-0.372, -0.250), vec2(-0.375, -0.250), segT);
    }
    if (localT >= 0.539 && localT <= 0.553) {
      float segT = (localT - 0.539) / 0.013;
      return mix(vec2(-0.375, -0.250), vec2(-0.378, -0.250), segT);
    }
    if (localT >= 0.553 && localT <= 0.566) {
      float segT = (localT - 0.553) / 0.013;
      return mix(vec2(-0.378, -0.250), vec2(-0.382, -0.250), segT);
    }
    if (localT >= 0.566 && localT <= 0.579) {
      float segT = (localT - 0.566) / 0.013;
      return mix(vec2(-0.382, -0.250), vec2(-0.385, -0.250), segT);
    }
    if (localT >= 0.579 && localT <= 0.592) {
      float segT = (localT - 0.579) / 0.013;
      return mix(vec2(-0.385, -0.250), vec2(-0.388, -0.250), segT);
    }
    if (localT >= 0.592 && localT <= 0.605) {
      float segT = (localT - 0.592) / 0.013;
      return mix(vec2(-0.388, -0.250), vec2(-0.392, -0.250), segT);
    }
    if (localT >= 0.605 && localT <= 0.618) {
      float segT = (localT - 0.605) / 0.013;
      return mix(vec2(-0.392, -0.250), vec2(-0.395, -0.250), segT);
    }
    if (localT >= 0.618 && localT <= 0.632) {
      float segT = (localT - 0.618) / 0.013;
      return mix(vec2(-0.395, -0.250), vec2(-0.398, -0.250), segT);
    }
    if (localT >= 0.632 && localT <= 0.645) {
      float segT = (localT - 0.632) / 0.013;
      return mix(vec2(-0.398, -0.250), vec2(-0.402, -0.250), segT);
    }
    if (localT >= 0.645 && localT <= 0.658) {
      float segT = (localT - 0.645) / 0.013;
      return mix(vec2(-0.402, -0.250), vec2(-0.402, -0.253), segT);
    }
    if (localT >= 0.658 && localT <= 0.671) {
      float segT = (localT - 0.658) / 0.013;
      return mix(vec2(-0.402, -0.253), vec2(-0.405, -0.253), segT);
    }
    if (localT >= 0.671 && localT <= 0.684) {
      float segT = (localT - 0.671) / 0.013;
      return mix(vec2(-0.405, -0.253), vec2(-0.398, -0.243), segT);
    }
    if (localT >= 0.684 && localT <= 0.697) {
      float segT = (localT - 0.684) / 0.013;
      return mix(vec2(-0.398, -0.243), vec2(-0.395, -0.243), segT);
    }
    if (localT >= 0.697 && localT <= 0.711) {
      float segT = (localT - 0.697) / 0.013;
      return mix(vec2(-0.395, -0.243), vec2(-0.385, -0.237), segT);
    }
    if (localT >= 0.711 && localT <= 0.724) {
      float segT = (localT - 0.711) / 0.013;
      return mix(vec2(-0.385, -0.237), vec2(-0.372, -0.230), segT);
    }
    if (localT >= 0.724 && localT <= 0.737) {
      float segT = (localT - 0.724) / 0.013;
      return mix(vec2(-0.372, -0.230), vec2(-0.365, -0.227), segT);
    }
    if (localT >= 0.737 && localT <= 0.750) {
      float segT = (localT - 0.737) / 0.013;
      return mix(vec2(-0.365, -0.227), vec2(-0.362, -0.223), segT);
    }
    if (localT >= 0.750 && localT <= 0.763) {
      float segT = (localT - 0.750) / 0.013;
      return mix(vec2(-0.362, -0.223), vec2(-0.358, -0.223), segT);
    }
    if (localT >= 0.763 && localT <= 0.776) {
      float segT = (localT - 0.763) / 0.013;
      return mix(vec2(-0.358, -0.223), vec2(-0.342, -0.217), segT);
    }
    if (localT >= 0.776 && localT <= 0.789) {
      float segT = (localT - 0.776) / 0.013;
      return mix(vec2(-0.342, -0.217), vec2(-0.335, -0.213), segT);
    }
    if (localT >= 0.789 && localT <= 0.803) {
      float segT = (localT - 0.789) / 0.013;
      return mix(vec2(-0.335, -0.213), vec2(-0.328, -0.210), segT);
    }
    if (localT >= 0.803 && localT <= 0.816) {
      float segT = (localT - 0.803) / 0.013;
      return mix(vec2(-0.328, -0.210), vec2(-0.325, -0.210), segT);
    }
    if (localT >= 0.816 && localT <= 0.829) {
      float segT = (localT - 0.816) / 0.013;
      return mix(vec2(-0.325, -0.210), vec2(-0.312, -0.203), segT);
    }
    if (localT >= 0.829 && localT <= 0.842) {
      float segT = (localT - 0.829) / 0.013;
      return mix(vec2(-0.312, -0.203), vec2(-0.305, -0.203), segT);
    }
    if (localT >= 0.842 && localT <= 0.855) {
      float segT = (localT - 0.842) / 0.013;
      return mix(vec2(-0.305, -0.203), vec2(-0.298, -0.203), segT);
    }
    if (localT >= 0.855 && localT <= 0.868) {
      float segT = (localT - 0.855) / 0.013;
      return mix(vec2(-0.298, -0.203), vec2(-0.295, -0.200), segT);
    }
    if (localT >= 0.868 && localT <= 0.882) {
      float segT = (localT - 0.868) / 0.013;
      return mix(vec2(-0.295, -0.200), vec2(-0.292, -0.200), segT);
    }
    if (localT >= 0.882 && localT <= 0.895) {
      float segT = (localT - 0.882) / 0.013;
      return mix(vec2(-0.292, -0.200), vec2(-0.268, -0.190), segT);
    }
    if (localT >= 0.895 && localT <= 0.908) {
      float segT = (localT - 0.895) / 0.013;
      return mix(vec2(-0.268, -0.190), vec2(-0.262, -0.183), segT);
    }
    if (localT >= 0.908 && localT <= 0.921) {
      float segT = (localT - 0.908) / 0.013;
      return mix(vec2(-0.262, -0.183), vec2(-0.258, -0.180), segT);
    }
    if (localT >= 0.921 && localT <= 0.934) {
      float segT = (localT - 0.921) / 0.013;
      return mix(vec2(-0.258, -0.180), vec2(-0.235, -0.167), segT);
    }
    if (localT >= 0.934 && localT <= 0.947) {
      float segT = (localT - 0.934) / 0.013;
      return mix(vec2(-0.235, -0.167), vec2(-0.228, -0.163), segT);
    }
    if (localT >= 0.947 && localT <= 0.961) {
      float segT = (localT - 0.947) / 0.013;
      return mix(vec2(-0.228, -0.163), vec2(-0.225, -0.160), segT);
    }
    if (localT >= 0.961 && localT <= 0.974) {
      float segT = (localT - 0.961) / 0.013;
      return mix(vec2(-0.225, -0.160), vec2(-0.222, -0.160), segT);
    }
    if (localT >= 0.974 && localT <= 0.987) {
      float segT = (localT - 0.974) / 0.013;
      return mix(vec2(-0.222, -0.160), vec2(-0.218, -0.157), segT);
    }
    if (localT >= 0.987 && localT <= 1.000) {
      float segT = (localT - 0.987) / 0.013;
      return mix(vec2(-0.218, -0.157), vec2(-0.215, -0.157), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 5) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.009) {
      float segT = (localT - 0.000) / 0.009;
      return mix(vec2(-0.372, -0.307), vec2(-0.365, -0.307), segT);
    }
    if (localT >= 0.009 && localT <= 0.018) {
      float segT = (localT - 0.009) / 0.009;
      return mix(vec2(-0.365, -0.307), vec2(-0.355, -0.307), segT);
    }
    if (localT >= 0.018 && localT <= 0.027) {
      float segT = (localT - 0.018) / 0.009;
      return mix(vec2(-0.355, -0.307), vec2(-0.338, -0.303), segT);
    }
    if (localT >= 0.027 && localT <= 0.036) {
      float segT = (localT - 0.027) / 0.009;
      return mix(vec2(-0.338, -0.303), vec2(-0.335, -0.303), segT);
    }
    if (localT >= 0.036 && localT <= 0.045) {
      float segT = (localT - 0.036) / 0.009;
      return mix(vec2(-0.335, -0.303), vec2(-0.325, -0.300), segT);
    }
    if (localT >= 0.045 && localT <= 0.054) {
      float segT = (localT - 0.045) / 0.009;
      return mix(vec2(-0.325, -0.300), vec2(-0.298, -0.290), segT);
    }
    if (localT >= 0.054 && localT <= 0.063) {
      float segT = (localT - 0.054) / 0.009;
      return mix(vec2(-0.298, -0.290), vec2(-0.288, -0.287), segT);
    }
    if (localT >= 0.063 && localT <= 0.072) {
      float segT = (localT - 0.063) / 0.009;
      return mix(vec2(-0.288, -0.287), vec2(-0.282, -0.287), segT);
    }
    if (localT >= 0.072 && localT <= 0.081) {
      float segT = (localT - 0.072) / 0.009;
      return mix(vec2(-0.282, -0.287), vec2(-0.255, -0.277), segT);
    }
    if (localT >= 0.081 && localT <= 0.090) {
      float segT = (localT - 0.081) / 0.009;
      return mix(vec2(-0.255, -0.277), vec2(-0.248, -0.273), segT);
    }
    if (localT >= 0.090 && localT <= 0.099) {
      float segT = (localT - 0.090) / 0.009;
      return mix(vec2(-0.248, -0.273), vec2(-0.222, -0.263), segT);
    }
    if (localT >= 0.099 && localT <= 0.108) {
      float segT = (localT - 0.099) / 0.009;
      return mix(vec2(-0.222, -0.263), vec2(-0.208, -0.260), segT);
    }
    if (localT >= 0.108 && localT <= 0.117) {
      float segT = (localT - 0.108) / 0.009;
      return mix(vec2(-0.208, -0.260), vec2(-0.178, -0.243), segT);
    }
    if (localT >= 0.117 && localT <= 0.126) {
      float segT = (localT - 0.117) / 0.009;
      return mix(vec2(-0.178, -0.243), vec2(-0.168, -0.243), segT);
    }
    if (localT >= 0.126 && localT <= 0.135) {
      float segT = (localT - 0.126) / 0.009;
      return mix(vec2(-0.168, -0.243), vec2(-0.165, -0.240), segT);
    }
    if (localT >= 0.135 && localT <= 0.144) {
      float segT = (localT - 0.135) / 0.009;
      return mix(vec2(-0.165, -0.240), vec2(-0.145, -0.230), segT);
    }
    if (localT >= 0.144 && localT <= 0.153) {
      float segT = (localT - 0.144) / 0.009;
      return mix(vec2(-0.145, -0.230), vec2(-0.135, -0.227), segT);
    }
    if (localT >= 0.153 && localT <= 0.162) {
      float segT = (localT - 0.153) / 0.009;
      return mix(vec2(-0.135, -0.227), vec2(-0.132, -0.227), segT);
    }
    if (localT >= 0.162 && localT <= 0.171) {
      float segT = (localT - 0.162) / 0.009;
      return mix(vec2(-0.132, -0.227), vec2(-0.115, -0.220), segT);
    }
    if (localT >= 0.171 && localT <= 0.180) {
      float segT = (localT - 0.171) / 0.009;
      return mix(vec2(-0.115, -0.220), vec2(-0.112, -0.217), segT);
    }
    if (localT >= 0.180 && localT <= 0.189) {
      float segT = (localT - 0.180) / 0.009;
      return mix(vec2(-0.112, -0.217), vec2(-0.105, -0.213), segT);
    }
    if (localT >= 0.189 && localT <= 0.198) {
      float segT = (localT - 0.189) / 0.009;
      return mix(vec2(-0.105, -0.213), vec2(-0.098, -0.210), segT);
    }
    if (localT >= 0.198 && localT <= 0.207) {
      float segT = (localT - 0.198) / 0.009;
      return mix(vec2(-0.098, -0.210), vec2(-0.092, -0.207), segT);
    }
    if (localT >= 0.207 && localT <= 0.216) {
      float segT = (localT - 0.207) / 0.009;
      return mix(vec2(-0.092, -0.207), vec2(-0.058, -0.187), segT);
    }
    if (localT >= 0.216 && localT <= 0.225) {
      float segT = (localT - 0.216) / 0.009;
      return mix(vec2(-0.058, -0.187), vec2(-0.055, -0.187), segT);
    }
    if (localT >= 0.225 && localT <= 0.234) {
      float segT = (localT - 0.225) / 0.009;
      return mix(vec2(-0.055, -0.187), vec2(-0.062, -0.187), segT);
    }
    if (localT >= 0.234 && localT <= 0.243) {
      float segT = (localT - 0.234) / 0.009;
      return mix(vec2(-0.062, -0.187), vec2(-0.068, -0.187), segT);
    }
    if (localT >= 0.243 && localT <= 0.252) {
      float segT = (localT - 0.243) / 0.009;
      return mix(vec2(-0.068, -0.187), vec2(-0.072, -0.187), segT);
    }
    if (localT >= 0.252 && localT <= 0.261) {
      float segT = (localT - 0.252) / 0.009;
      return mix(vec2(-0.072, -0.187), vec2(-0.085, -0.193), segT);
    }
    if (localT >= 0.261 && localT <= 0.270) {
      float segT = (localT - 0.261) / 0.009;
      return mix(vec2(-0.085, -0.193), vec2(-0.088, -0.197), segT);
    }
    if (localT >= 0.270 && localT <= 0.279) {
      float segT = (localT - 0.270) / 0.009;
      return mix(vec2(-0.088, -0.197), vec2(-0.095, -0.197), segT);
    }
    if (localT >= 0.279 && localT <= 0.288) {
      float segT = (localT - 0.279) / 0.009;
      return mix(vec2(-0.095, -0.197), vec2(-0.102, -0.200), segT);
    }
    if (localT >= 0.288 && localT <= 0.297) {
      float segT = (localT - 0.288) / 0.009;
      return mix(vec2(-0.102, -0.200), vec2(-0.105, -0.200), segT);
    }
    if (localT >= 0.297 && localT <= 0.306) {
      float segT = (localT - 0.297) / 0.009;
      return mix(vec2(-0.105, -0.200), vec2(-0.108, -0.203), segT);
    }
    if (localT >= 0.306 && localT <= 0.315) {
      float segT = (localT - 0.306) / 0.009;
      return mix(vec2(-0.108, -0.203), vec2(-0.115, -0.207), segT);
    }
    if (localT >= 0.315 && localT <= 0.324) {
      float segT = (localT - 0.315) / 0.009;
      return mix(vec2(-0.115, -0.207), vec2(-0.118, -0.207), segT);
    }
    if (localT >= 0.324 && localT <= 0.333) {
      float segT = (localT - 0.324) / 0.009;
      return mix(vec2(-0.118, -0.207), vec2(-0.122, -0.207), segT);
    }
    if (localT >= 0.333 && localT <= 0.342) {
      float segT = (localT - 0.333) / 0.009;
      return mix(vec2(-0.122, -0.207), vec2(-0.125, -0.207), segT);
    }
    if (localT >= 0.342 && localT <= 0.351) {
      float segT = (localT - 0.342) / 0.009;
      return mix(vec2(-0.125, -0.207), vec2(-0.128, -0.210), segT);
    }
    if (localT >= 0.351 && localT <= 0.360) {
      float segT = (localT - 0.351) / 0.009;
      return mix(vec2(-0.128, -0.210), vec2(-0.132, -0.213), segT);
    }
    if (localT >= 0.360 && localT <= 0.369) {
      float segT = (localT - 0.360) / 0.009;
      return mix(vec2(-0.132, -0.213), vec2(-0.135, -0.213), segT);
    }
    if (localT >= 0.369 && localT <= 0.378) {
      float segT = (localT - 0.369) / 0.009;
      return mix(vec2(-0.135, -0.213), vec2(-0.138, -0.217), segT);
    }
    if (localT >= 0.378 && localT <= 0.387) {
      float segT = (localT - 0.378) / 0.009;
      return mix(vec2(-0.138, -0.217), vec2(-0.142, -0.217), segT);
    }
    if (localT >= 0.387 && localT <= 0.396) {
      float segT = (localT - 0.387) / 0.009;
      return mix(vec2(-0.142, -0.217), vec2(-0.145, -0.220), segT);
    }
    if (localT >= 0.396 && localT <= 0.405) {
      float segT = (localT - 0.396) / 0.009;
      return mix(vec2(-0.145, -0.220), vec2(-0.145, -0.223), segT);
    }
    if (localT >= 0.405 && localT <= 0.414) {
      float segT = (localT - 0.405) / 0.009;
      return mix(vec2(-0.145, -0.223), vec2(-0.145, -0.227), segT);
    }
    if (localT >= 0.414 && localT <= 0.423) {
      float segT = (localT - 0.414) / 0.009;
      return mix(vec2(-0.145, -0.227), vec2(-0.145, -0.230), segT);
    }
    if (localT >= 0.423 && localT <= 0.432) {
      float segT = (localT - 0.423) / 0.009;
      return mix(vec2(-0.145, -0.230), vec2(-0.145, -0.237), segT);
    }
    if (localT >= 0.432 && localT <= 0.441) {
      float segT = (localT - 0.432) / 0.009;
      return mix(vec2(-0.145, -0.237), vec2(-0.145, -0.243), segT);
    }
    if (localT >= 0.441 && localT <= 0.450) {
      float segT = (localT - 0.441) / 0.009;
      return mix(vec2(-0.145, -0.243), vec2(-0.142, -0.243), segT);
    }
    if (localT >= 0.450 && localT <= 0.459) {
      float segT = (localT - 0.450) / 0.009;
      return mix(vec2(-0.142, -0.243), vec2(-0.142, -0.250), segT);
    }
    if (localT >= 0.459 && localT <= 0.468) {
      float segT = (localT - 0.459) / 0.009;
      return mix(vec2(-0.142, -0.250), vec2(-0.135, -0.263), segT);
    }
    if (localT >= 0.468 && localT <= 0.477) {
      float segT = (localT - 0.468) / 0.009;
      return mix(vec2(-0.135, -0.263), vec2(-0.132, -0.267), segT);
    }
    if (localT >= 0.477 && localT <= 0.486) {
      float segT = (localT - 0.477) / 0.009;
      return mix(vec2(-0.132, -0.267), vec2(-0.132, -0.270), segT);
    }
    if (localT >= 0.486 && localT <= 0.495) {
      float segT = (localT - 0.486) / 0.009;
      return mix(vec2(-0.132, -0.270), vec2(-0.128, -0.273), segT);
    }
    if (localT >= 0.495 && localT <= 0.505) {
      float segT = (localT - 0.495) / 0.009;
      return mix(vec2(-0.128, -0.273), vec2(-0.128, -0.277), segT);
    }
    if (localT >= 0.505 && localT <= 0.514) {
      float segT = (localT - 0.505) / 0.009;
      return mix(vec2(-0.128, -0.277), vec2(-0.128, -0.280), segT);
    }
    if (localT >= 0.514 && localT <= 0.523) {
      float segT = (localT - 0.514) / 0.009;
      return mix(vec2(-0.128, -0.280), vec2(-0.132, -0.277), segT);
    }
    if (localT >= 0.523 && localT <= 0.532) {
      float segT = (localT - 0.523) / 0.009;
      return mix(vec2(-0.132, -0.277), vec2(-0.132, -0.270), segT);
    }
    if (localT >= 0.532 && localT <= 0.541) {
      float segT = (localT - 0.532) / 0.009;
      return mix(vec2(-0.132, -0.270), vec2(-0.132, -0.237), segT);
    }
    if (localT >= 0.541 && localT <= 0.550) {
      float segT = (localT - 0.541) / 0.009;
      return mix(vec2(-0.132, -0.237), vec2(-0.132, -0.227), segT);
    }
    if (localT >= 0.550 && localT <= 0.559) {
      float segT = (localT - 0.550) / 0.009;
      return mix(vec2(-0.132, -0.227), vec2(-0.132, -0.220), segT);
    }
    if (localT >= 0.559 && localT <= 0.568) {
      float segT = (localT - 0.559) / 0.009;
      return mix(vec2(-0.132, -0.220), vec2(-0.142, -0.193), segT);
    }
    if (localT >= 0.568 && localT <= 0.577) {
      float segT = (localT - 0.568) / 0.009;
      return mix(vec2(-0.142, -0.193), vec2(-0.145, -0.187), segT);
    }
    if (localT >= 0.577 && localT <= 0.586) {
      float segT = (localT - 0.577) / 0.009;
      return mix(vec2(-0.145, -0.187), vec2(-0.162, -0.140), segT);
    }
    if (localT >= 0.586 && localT <= 0.595) {
      float segT = (localT - 0.586) / 0.009;
      return mix(vec2(-0.162, -0.140), vec2(-0.172, -0.120), segT);
    }
    if (localT >= 0.595 && localT <= 0.604) {
      float segT = (localT - 0.595) / 0.009;
      return mix(vec2(-0.172, -0.120), vec2(-0.178, -0.103), segT);
    }
    if (localT >= 0.604 && localT <= 0.613) {
      float segT = (localT - 0.604) / 0.009;
      return mix(vec2(-0.178, -0.103), vec2(-0.192, -0.070), segT);
    }
    if (localT >= 0.613 && localT <= 0.622) {
      float segT = (localT - 0.613) / 0.009;
      return mix(vec2(-0.192, -0.070), vec2(-0.192, -0.067), segT);
    }
    if (localT >= 0.622 && localT <= 0.631) {
      float segT = (localT - 0.622) / 0.009;
      return mix(vec2(-0.192, -0.067), vec2(-0.192, -0.063), segT);
    }
    if (localT >= 0.631 && localT <= 0.640) {
      float segT = (localT - 0.631) / 0.009;
      return mix(vec2(-0.192, -0.063), vec2(-0.198, -0.053), segT);
    }
    if (localT >= 0.640 && localT <= 0.649) {
      float segT = (localT - 0.640) / 0.009;
      return mix(vec2(-0.198, -0.053), vec2(-0.198, -0.050), segT);
    }
    if (localT >= 0.649 && localT <= 0.658) {
      float segT = (localT - 0.649) / 0.009;
      return mix(vec2(-0.198, -0.050), vec2(-0.202, -0.043), segT);
    }
    if (localT >= 0.658 && localT <= 0.667) {
      float segT = (localT - 0.658) / 0.009;
      return mix(vec2(-0.202, -0.043), vec2(-0.205, -0.033), segT);
    }
    if (localT >= 0.667 && localT <= 0.676) {
      float segT = (localT - 0.667) / 0.009;
      return mix(vec2(-0.205, -0.033), vec2(-0.222, -0.010), segT);
    }
    if (localT >= 0.676 && localT <= 0.685) {
      float segT = (localT - 0.676) / 0.009;
      return mix(vec2(-0.222, -0.010), vec2(-0.232, 0.000), segT);
    }
    if (localT >= 0.685 && localT <= 0.694) {
      float segT = (localT - 0.685) / 0.009;
      return mix(vec2(-0.232, 0.000), vec2(-0.235, 0.007), segT);
    }
    if (localT >= 0.694 && localT <= 0.703) {
      float segT = (localT - 0.694) / 0.009;
      return mix(vec2(-0.235, 0.007), vec2(-0.238, 0.010), segT);
    }
    if (localT >= 0.703 && localT <= 0.712) {
      float segT = (localT - 0.703) / 0.009;
      return mix(vec2(-0.238, 0.010), vec2(-0.242, 0.027), segT);
    }
    if (localT >= 0.712 && localT <= 0.721) {
      float segT = (localT - 0.712) / 0.009;
      return mix(vec2(-0.242, 0.027), vec2(-0.242, 0.030), segT);
    }
    if (localT >= 0.721 && localT <= 0.730) {
      float segT = (localT - 0.721) / 0.009;
      return mix(vec2(-0.242, 0.030), vec2(-0.245, 0.033), segT);
    }
    if (localT >= 0.730 && localT <= 0.739) {
      float segT = (localT - 0.730) / 0.009;
      return mix(vec2(-0.245, 0.033), vec2(-0.245, 0.047), segT);
    }
    if (localT >= 0.739 && localT <= 0.748) {
      float segT = (localT - 0.739) / 0.009;
      return mix(vec2(-0.245, 0.047), vec2(-0.248, 0.050), segT);
    }
    if (localT >= 0.748 && localT <= 0.757) {
      float segT = (localT - 0.748) / 0.009;
      return mix(vec2(-0.248, 0.050), vec2(-0.248, 0.053), segT);
    }
    if (localT >= 0.757 && localT <= 0.766) {
      float segT = (localT - 0.757) / 0.009;
      return mix(vec2(-0.248, 0.053), vec2(-0.248, 0.057), segT);
    }
    if (localT >= 0.766 && localT <= 0.775) {
      float segT = (localT - 0.766) / 0.009;
      return mix(vec2(-0.248, 0.057), vec2(-0.252, 0.073), segT);
    }
    if (localT >= 0.775 && localT <= 0.784) {
      float segT = (localT - 0.775) / 0.009;
      return mix(vec2(-0.252, 0.073), vec2(-0.252, 0.077), segT);
    }
    if (localT >= 0.784 && localT <= 0.793) {
      float segT = (localT - 0.784) / 0.009;
      return mix(vec2(-0.252, 0.077), vec2(-0.252, 0.080), segT);
    }
    if (localT >= 0.793 && localT <= 0.802) {
      float segT = (localT - 0.793) / 0.009;
      return mix(vec2(-0.252, 0.080), vec2(-0.252, 0.083), segT);
    }
    if (localT >= 0.802 && localT <= 0.811) {
      float segT = (localT - 0.802) / 0.009;
      return mix(vec2(-0.252, 0.083), vec2(-0.252, 0.077), segT);
    }
    if (localT >= 0.811 && localT <= 0.820) {
      float segT = (localT - 0.811) / 0.009;
      return mix(vec2(-0.252, 0.077), vec2(-0.252, 0.067), segT);
    }
    if (localT >= 0.820 && localT <= 0.829) {
      float segT = (localT - 0.820) / 0.009;
      return mix(vec2(-0.252, 0.067), vec2(-0.252, 0.053), segT);
    }
    if (localT >= 0.829 && localT <= 0.838) {
      float segT = (localT - 0.829) / 0.009;
      return mix(vec2(-0.252, 0.053), vec2(-0.262, -0.033), segT);
    }
    if (localT >= 0.838 && localT <= 0.847) {
      float segT = (localT - 0.838) / 0.009;
      return mix(vec2(-0.262, -0.033), vec2(-0.265, -0.047), segT);
    }
    if (localT >= 0.847 && localT <= 0.856) {
      float segT = (localT - 0.847) / 0.009;
      return mix(vec2(-0.265, -0.047), vec2(-0.268, -0.067), segT);
    }
    if (localT >= 0.856 && localT <= 0.865) {
      float segT = (localT - 0.856) / 0.009;
      return mix(vec2(-0.268, -0.067), vec2(-0.275, -0.123), segT);
    }
    if (localT >= 0.865 && localT <= 0.874) {
      float segT = (localT - 0.865) / 0.009;
      return mix(vec2(-0.275, -0.123), vec2(-0.278, -0.133), segT);
    }
    if (localT >= 0.874 && localT <= 0.883) {
      float segT = (localT - 0.874) / 0.009;
      return mix(vec2(-0.278, -0.133), vec2(-0.278, -0.143), segT);
    }
    if (localT >= 0.883 && localT <= 0.892) {
      float segT = (localT - 0.883) / 0.009;
      return mix(vec2(-0.278, -0.143), vec2(-0.278, -0.203), segT);
    }
    if (localT >= 0.892 && localT <= 0.901) {
      float segT = (localT - 0.892) / 0.009;
      return mix(vec2(-0.278, -0.203), vec2(-0.278, -0.217), segT);
    }
    if (localT >= 0.901 && localT <= 0.910) {
      float segT = (localT - 0.901) / 0.009;
      return mix(vec2(-0.278, -0.217), vec2(-0.278, -0.233), segT);
    }
    if (localT >= 0.910 && localT <= 0.919) {
      float segT = (localT - 0.910) / 0.009;
      return mix(vec2(-0.278, -0.233), vec2(-0.278, -0.297), segT);
    }
    if (localT >= 0.919 && localT <= 0.928) {
      float segT = (localT - 0.919) / 0.009;
      return mix(vec2(-0.278, -0.297), vec2(-0.278, -0.307), segT);
    }
    if (localT >= 0.928 && localT <= 0.937) {
      float segT = (localT - 0.928) / 0.009;
      return mix(vec2(-0.278, -0.307), vec2(-0.278, -0.333), segT);
    }
    if (localT >= 0.937 && localT <= 0.946) {
      float segT = (localT - 0.937) / 0.009;
      return mix(vec2(-0.278, -0.333), vec2(-0.282, -0.340), segT);
    }
    if (localT >= 0.946 && localT <= 0.955) {
      float segT = (localT - 0.946) / 0.009;
      return mix(vec2(-0.282, -0.340), vec2(-0.285, -0.350), segT);
    }
    if (localT >= 0.955 && localT <= 0.964) {
      float segT = (localT - 0.955) / 0.009;
      return mix(vec2(-0.285, -0.350), vec2(-0.288, -0.360), segT);
    }
    if (localT >= 0.964 && localT <= 0.973) {
      float segT = (localT - 0.964) / 0.009;
      return mix(vec2(-0.288, -0.360), vec2(-0.288, -0.363), segT);
    }
    if (localT >= 0.973 && localT <= 0.982) {
      float segT = (localT - 0.973) / 0.009;
      return mix(vec2(-0.288, -0.363), vec2(-0.292, -0.380), segT);
    }
    if (localT >= 0.982 && localT <= 0.991) {
      float segT = (localT - 0.982) / 0.009;
      return mix(vec2(-0.292, -0.380), vec2(-0.295, -0.390), segT);
    }
    if (localT >= 0.991 && localT <= 1.000) {
      float segT = (localT - 0.991) / 0.009;
      return mix(vec2(-0.295, -0.390), vec2(-0.295, -0.397), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 6) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.017) {
      float segT = (localT - 0.000) / 0.017;
      return mix(vec2(-0.078, -0.053), vec2(-0.078, -0.057), segT);
    }
    if (localT >= 0.017 && localT <= 0.034) {
      float segT = (localT - 0.017) / 0.017;
      return mix(vec2(-0.078, -0.057), vec2(-0.078, -0.063), segT);
    }
    if (localT >= 0.034 && localT <= 0.052) {
      float segT = (localT - 0.034) / 0.017;
      return mix(vec2(-0.078, -0.063), vec2(-0.078, -0.067), segT);
    }
    if (localT >= 0.052 && localT <= 0.069) {
      float segT = (localT - 0.052) / 0.017;
      return mix(vec2(-0.078, -0.067), vec2(-0.078, -0.090), segT);
    }
    if (localT >= 0.069 && localT <= 0.086) {
      float segT = (localT - 0.069) / 0.017;
      return mix(vec2(-0.078, -0.090), vec2(-0.078, -0.100), segT);
    }
    if (localT >= 0.086 && localT <= 0.103) {
      float segT = (localT - 0.086) / 0.017;
      return mix(vec2(-0.078, -0.100), vec2(-0.078, -0.143), segT);
    }
    if (localT >= 0.103 && localT <= 0.121) {
      float segT = (localT - 0.103) / 0.017;
      return mix(vec2(-0.078, -0.143), vec2(-0.075, -0.153), segT);
    }
    if (localT >= 0.121 && localT <= 0.138) {
      float segT = (localT - 0.121) / 0.017;
      return mix(vec2(-0.075, -0.153), vec2(-0.075, -0.197), segT);
    }
    if (localT >= 0.138 && localT <= 0.155) {
      float segT = (localT - 0.138) / 0.017;
      return mix(vec2(-0.075, -0.197), vec2(-0.075, -0.203), segT);
    }
    if (localT >= 0.155 && localT <= 0.172) {
      float segT = (localT - 0.155) / 0.017;
      return mix(vec2(-0.075, -0.203), vec2(-0.075, -0.213), segT);
    }
    if (localT >= 0.172 && localT <= 0.190) {
      float segT = (localT - 0.172) / 0.017;
      return mix(vec2(-0.075, -0.213), vec2(-0.075, -0.250), segT);
    }
    if (localT >= 0.190 && localT <= 0.207) {
      float segT = (localT - 0.190) / 0.017;
      return mix(vec2(-0.075, -0.250), vec2(-0.075, -0.260), segT);
    }
    if (localT >= 0.207 && localT <= 0.224) {
      float segT = (localT - 0.207) / 0.017;
      return mix(vec2(-0.075, -0.260), vec2(-0.075, -0.267), segT);
    }
    if (localT >= 0.224 && localT <= 0.241) {
      float segT = (localT - 0.224) / 0.017;
      return mix(vec2(-0.075, -0.267), vec2(-0.068, -0.297), segT);
    }
    if (localT >= 0.241 && localT <= 0.259) {
      float segT = (localT - 0.241) / 0.017;
      return mix(vec2(-0.068, -0.297), vec2(-0.068, -0.300), segT);
    }
    if (localT >= 0.259 && localT <= 0.276) {
      float segT = (localT - 0.259) / 0.017;
      return mix(vec2(-0.068, -0.300), vec2(-0.065, -0.307), segT);
    }
    if (localT >= 0.276 && localT <= 0.293) {
      float segT = (localT - 0.276) / 0.017;
      return mix(vec2(-0.065, -0.307), vec2(-0.065, -0.333), segT);
    }
    if (localT >= 0.293 && localT <= 0.310) {
      float segT = (localT - 0.293) / 0.017;
      return mix(vec2(-0.065, -0.333), vec2(-0.065, -0.343), segT);
    }
    if (localT >= 0.310 && localT <= 0.328) {
      float segT = (localT - 0.310) / 0.017;
      return mix(vec2(-0.065, -0.343), vec2(-0.065, -0.350), segT);
    }
    if (localT >= 0.328 && localT <= 0.345) {
      float segT = (localT - 0.328) / 0.017;
      return mix(vec2(-0.065, -0.350), vec2(-0.065, -0.360), segT);
    }
    if (localT >= 0.345 && localT <= 0.362) {
      float segT = (localT - 0.345) / 0.017;
      return mix(vec2(-0.065, -0.360), vec2(-0.065, -0.397), segT);
    }
    if (localT >= 0.362 && localT <= 0.379) {
      float segT = (localT - 0.362) / 0.017;
      return mix(vec2(-0.065, -0.397), vec2(-0.062, -0.400), segT);
    }
    if (localT >= 0.379 && localT <= 0.397) {
      float segT = (localT - 0.379) / 0.017;
      return mix(vec2(-0.062, -0.400), vec2(-0.062, -0.403), segT);
    }
    if (localT >= 0.397 && localT <= 0.414) {
      float segT = (localT - 0.397) / 0.017;
      return mix(vec2(-0.062, -0.403), vec2(-0.062, -0.413), segT);
    }
    if (localT >= 0.414 && localT <= 0.431) {
      float segT = (localT - 0.414) / 0.017;
      return mix(vec2(-0.062, -0.413), vec2(-0.062, -0.417), segT);
    }
    if (localT >= 0.431 && localT <= 0.448) {
      float segT = (localT - 0.431) / 0.017;
      return mix(vec2(-0.062, -0.417), vec2(-0.058, -0.423), segT);
    }
    if (localT >= 0.448 && localT <= 0.466) {
      float segT = (localT - 0.448) / 0.017;
      return mix(vec2(-0.058, -0.423), vec2(-0.058, -0.440), segT);
    }
    if (localT >= 0.466 && localT <= 0.483) {
      float segT = (localT - 0.466) / 0.017;
      return mix(vec2(-0.058, -0.440), vec2(-0.058, -0.447), segT);
    }
    if (localT >= 0.483 && localT <= 0.500) {
      float segT = (localT - 0.483) / 0.017;
      return mix(vec2(-0.058, -0.447), vec2(-0.058, -0.450), segT);
    }
    if (localT >= 0.500 && localT <= 0.517) {
      float segT = (localT - 0.500) / 0.017;
      return mix(vec2(-0.058, -0.450), vec2(-0.058, -0.447), segT);
    }
    if (localT >= 0.517 && localT <= 0.534) {
      float segT = (localT - 0.517) / 0.017;
      return mix(vec2(-0.058, -0.447), vec2(-0.052, -0.437), segT);
    }
    if (localT >= 0.534 && localT <= 0.552) {
      float segT = (localT - 0.534) / 0.017;
      return mix(vec2(-0.052, -0.437), vec2(-0.038, -0.397), segT);
    }
    if (localT >= 0.552 && localT <= 0.569) {
      float segT = (localT - 0.552) / 0.017;
      return mix(vec2(-0.038, -0.397), vec2(-0.035, -0.387), segT);
    }
    if (localT >= 0.569 && localT <= 0.586) {
      float segT = (localT - 0.569) / 0.017;
      return mix(vec2(-0.035, -0.387), vec2(-0.028, -0.370), segT);
    }
    if (localT >= 0.586 && localT <= 0.603) {
      float segT = (localT - 0.586) / 0.017;
      return mix(vec2(-0.028, -0.370), vec2(-0.018, -0.340), segT);
    }
    if (localT >= 0.603 && localT <= 0.621) {
      float segT = (localT - 0.603) / 0.017;
      return mix(vec2(-0.018, -0.340), vec2(-0.018, -0.330), segT);
    }
    if (localT >= 0.621 && localT <= 0.638) {
      float segT = (localT - 0.621) / 0.017;
      return mix(vec2(-0.018, -0.330), vec2(-0.018, -0.320), segT);
    }
    if (localT >= 0.638 && localT <= 0.655) {
      float segT = (localT - 0.638) / 0.017;
      return mix(vec2(-0.018, -0.320), vec2(-0.008, -0.280), segT);
    }
    if (localT >= 0.655 && localT <= 0.672) {
      float segT = (localT - 0.655) / 0.017;
      return mix(vec2(-0.008, -0.280), vec2(-0.005, -0.270), segT);
    }
    if (localT >= 0.672 && localT <= 0.690) {
      float segT = (localT - 0.672) / 0.017;
      return mix(vec2(-0.005, -0.270), vec2(-0.002, -0.263), segT);
    }
    if (localT >= 0.690 && localT <= 0.707) {
      float segT = (localT - 0.690) / 0.017;
      return mix(vec2(-0.002, -0.263), vec2(0.005, -0.230), segT);
    }
    if (localT >= 0.707 && localT <= 0.724) {
      float segT = (localT - 0.707) / 0.017;
      return mix(vec2(0.005, -0.230), vec2(0.012, -0.223), segT);
    }
    if (localT >= 0.724 && localT <= 0.741) {
      float segT = (localT - 0.724) / 0.017;
      return mix(vec2(0.012, -0.223), vec2(0.028, -0.187), segT);
    }
    if (localT >= 0.741 && localT <= 0.759) {
      float segT = (localT - 0.741) / 0.017;
      return mix(vec2(0.028, -0.187), vec2(0.028, -0.177), segT);
    }
    if (localT >= 0.759 && localT <= 0.776) {
      float segT = (localT - 0.759) / 0.017;
      return mix(vec2(0.028, -0.177), vec2(0.032, -0.170), segT);
    }
    if (localT >= 0.776 && localT <= 0.793) {
      float segT = (localT - 0.776) / 0.017;
      return mix(vec2(0.032, -0.170), vec2(0.042, -0.130), segT);
    }
    if (localT >= 0.793 && localT <= 0.810) {
      float segT = (localT - 0.793) / 0.017;
      return mix(vec2(0.042, -0.130), vec2(0.045, -0.127), segT);
    }
    if (localT >= 0.810 && localT <= 0.828) {
      float segT = (localT - 0.810) / 0.017;
      return mix(vec2(0.045, -0.127), vec2(0.052, -0.110), segT);
    }
    if (localT >= 0.828 && localT <= 0.845) {
      float segT = (localT - 0.828) / 0.017;
      return mix(vec2(0.052, -0.110), vec2(0.055, -0.107), segT);
    }
    if (localT >= 0.845 && localT <= 0.862) {
      float segT = (localT - 0.845) / 0.017;
      return mix(vec2(0.055, -0.107), vec2(0.058, -0.103), segT);
    }
    if (localT >= 0.862 && localT <= 0.879) {
      float segT = (localT - 0.862) / 0.017;
      return mix(vec2(0.058, -0.103), vec2(0.062, -0.093), segT);
    }
    if (localT >= 0.879 && localT <= 0.897) {
      float segT = (localT - 0.879) / 0.017;
      return mix(vec2(0.062, -0.093), vec2(0.075, -0.077), segT);
    }
    if (localT >= 0.897 && localT <= 0.914) {
      float segT = (localT - 0.897) / 0.017;
      return mix(vec2(0.075, -0.077), vec2(0.078, -0.070), segT);
    }
    if (localT >= 0.914 && localT <= 0.931) {
      float segT = (localT - 0.914) / 0.017;
      return mix(vec2(0.078, -0.070), vec2(0.085, -0.060), segT);
    }
    if (localT >= 0.931 && localT <= 0.948) {
      float segT = (localT - 0.931) / 0.017;
      return mix(vec2(0.085, -0.060), vec2(0.085, -0.057), segT);
    }
    if (localT >= 0.948 && localT <= 0.966) {
      float segT = (localT - 0.948) / 0.017;
      return mix(vec2(0.085, -0.057), vec2(0.092, -0.050), segT);
    }
    if (localT >= 0.966 && localT <= 0.983) {
      float segT = (localT - 0.966) / 0.017;
      return mix(vec2(0.092, -0.050), vec2(0.092, -0.047), segT);
    }
    if (localT >= 0.983 && localT <= 1.000) {
      float segT = (localT - 0.983) / 0.017;
      return mix(vec2(0.092, -0.047), vec2(0.095, -0.043), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 7) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.013) {
      float segT = (localT - 0.000) / 0.013;
      return mix(vec2(0.092, -0.170), vec2(0.095, -0.170), segT);
    }
    if (localT >= 0.013 && localT <= 0.026) {
      float segT = (localT - 0.013) / 0.013;
      return mix(vec2(0.095, -0.170), vec2(0.102, -0.170), segT);
    }
    if (localT >= 0.026 && localT <= 0.039) {
      float segT = (localT - 0.026) / 0.013;
      return mix(vec2(0.102, -0.170), vec2(0.105, -0.173), segT);
    }
    if (localT >= 0.039 && localT <= 0.053) {
      float segT = (localT - 0.039) / 0.013;
      return mix(vec2(0.105, -0.173), vec2(0.118, -0.183), segT);
    }
    if (localT >= 0.053 && localT <= 0.066) {
      float segT = (localT - 0.053) / 0.013;
      return mix(vec2(0.118, -0.183), vec2(0.122, -0.190), segT);
    }
    if (localT >= 0.066 && localT <= 0.079) {
      float segT = (localT - 0.066) / 0.013;
      return mix(vec2(0.122, -0.190), vec2(0.128, -0.197), segT);
    }
    if (localT >= 0.079 && localT <= 0.092) {
      float segT = (localT - 0.079) / 0.013;
      return mix(vec2(0.128, -0.197), vec2(0.135, -0.200), segT);
    }
    if (localT >= 0.092 && localT <= 0.105) {
      float segT = (localT - 0.092) / 0.013;
      return mix(vec2(0.135, -0.200), vec2(0.142, -0.210), segT);
    }
    if (localT >= 0.105 && localT <= 0.118) {
      float segT = (localT - 0.105) / 0.013;
      return mix(vec2(0.142, -0.210), vec2(0.148, -0.213), segT);
    }
    if (localT >= 0.118 && localT <= 0.132) {
      float segT = (localT - 0.118) / 0.013;
      return mix(vec2(0.148, -0.213), vec2(0.152, -0.220), segT);
    }
    if (localT >= 0.132 && localT <= 0.145) {
      float segT = (localT - 0.132) / 0.013;
      return mix(vec2(0.152, -0.220), vec2(0.158, -0.227), segT);
    }
    if (localT >= 0.145 && localT <= 0.158) {
      float segT = (localT - 0.145) / 0.013;
      return mix(vec2(0.158, -0.227), vec2(0.162, -0.227), segT);
    }
    if (localT >= 0.158 && localT <= 0.171) {
      float segT = (localT - 0.158) / 0.013;
      return mix(vec2(0.162, -0.227), vec2(0.162, -0.230), segT);
    }
    if (localT >= 0.171 && localT <= 0.184) {
      float segT = (localT - 0.171) / 0.013;
      return mix(vec2(0.162, -0.230), vec2(0.165, -0.233), segT);
    }
    if (localT >= 0.184 && localT <= 0.197) {
      float segT = (localT - 0.184) / 0.013;
      return mix(vec2(0.165, -0.233), vec2(0.168, -0.237), segT);
    }
    if (localT >= 0.197 && localT <= 0.211) {
      float segT = (localT - 0.197) / 0.013;
      return mix(vec2(0.168, -0.237), vec2(0.168, -0.243), segT);
    }
    if (localT >= 0.211 && localT <= 0.224) {
      float segT = (localT - 0.211) / 0.013;
      return mix(vec2(0.168, -0.243), vec2(0.165, -0.243), segT);
    }
    if (localT >= 0.224 && localT <= 0.237) {
      float segT = (localT - 0.224) / 0.013;
      return mix(vec2(0.165, -0.243), vec2(0.162, -0.243), segT);
    }
    if (localT >= 0.237 && localT <= 0.250) {
      float segT = (localT - 0.237) / 0.013;
      return mix(vec2(0.162, -0.243), vec2(0.155, -0.243), segT);
    }
    if (localT >= 0.250 && localT <= 0.263) {
      float segT = (localT - 0.250) / 0.013;
      return mix(vec2(0.155, -0.243), vec2(0.152, -0.240), segT);
    }
    if (localT >= 0.263 && localT <= 0.276) {
      float segT = (localT - 0.263) / 0.013;
      return mix(vec2(0.152, -0.240), vec2(0.142, -0.240), segT);
    }
    if (localT >= 0.276 && localT <= 0.289) {
      float segT = (localT - 0.276) / 0.013;
      return mix(vec2(0.142, -0.240), vec2(0.132, -0.237), segT);
    }
    if (localT >= 0.289 && localT <= 0.303) {
      float segT = (localT - 0.289) / 0.013;
      return mix(vec2(0.132, -0.237), vec2(0.122, -0.230), segT);
    }
    if (localT >= 0.303 && localT <= 0.316) {
      float segT = (localT - 0.303) / 0.013;
      return mix(vec2(0.122, -0.230), vec2(0.112, -0.220), segT);
    }
    if (localT >= 0.316 && localT <= 0.329) {
      float segT = (localT - 0.316) / 0.013;
      return mix(vec2(0.112, -0.220), vec2(0.105, -0.210), segT);
    }
    if (localT >= 0.329 && localT <= 0.342) {
      float segT = (localT - 0.329) / 0.013;
      return mix(vec2(0.105, -0.210), vec2(0.098, -0.203), segT);
    }
    if (localT >= 0.342 && localT <= 0.355) {
      float segT = (localT - 0.342) / 0.013;
      return mix(vec2(0.098, -0.203), vec2(0.095, -0.197), segT);
    }
    if (localT >= 0.355 && localT <= 0.368) {
      float segT = (localT - 0.355) / 0.013;
      return mix(vec2(0.095, -0.197), vec2(0.092, -0.190), segT);
    }
    if (localT >= 0.368 && localT <= 0.382) {
      float segT = (localT - 0.368) / 0.013;
      return mix(vec2(0.092, -0.190), vec2(0.088, -0.190), segT);
    }
    if (localT >= 0.382 && localT <= 0.395) {
      float segT = (localT - 0.382) / 0.013;
      return mix(vec2(0.088, -0.190), vec2(0.088, -0.187), segT);
    }
    if (localT >= 0.395 && localT <= 0.408) {
      float segT = (localT - 0.395) / 0.013;
      return mix(vec2(0.088, -0.187), vec2(0.085, -0.187), segT);
    }
    if (localT >= 0.408 && localT <= 0.421) {
      float segT = (localT - 0.408) / 0.013;
      return mix(vec2(0.085, -0.187), vec2(0.085, -0.183), segT);
    }
    if (localT >= 0.421 && localT <= 0.434) {
      float segT = (localT - 0.421) / 0.013;
      return mix(vec2(0.085, -0.183), vec2(0.082, -0.183), segT);
    }
    if (localT >= 0.434 && localT <= 0.447) {
      float segT = (localT - 0.434) / 0.013;
      return mix(vec2(0.082, -0.183), vec2(0.085, -0.183), segT);
    }
    if (localT >= 0.447 && localT <= 0.461) {
      float segT = (localT - 0.447) / 0.013;
      return mix(vec2(0.085, -0.183), vec2(0.092, -0.187), segT);
    }
    if (localT >= 0.461 && localT <= 0.474) {
      float segT = (localT - 0.461) / 0.013;
      return mix(vec2(0.092, -0.187), vec2(0.095, -0.193), segT);
    }
    if (localT >= 0.474 && localT <= 0.487) {
      float segT = (localT - 0.474) / 0.013;
      return mix(vec2(0.095, -0.193), vec2(0.102, -0.200), segT);
    }
    if (localT >= 0.487 && localT <= 0.500) {
      float segT = (localT - 0.487) / 0.013;
      return mix(vec2(0.102, -0.200), vec2(0.105, -0.207), segT);
    }
    if (localT >= 0.500 && localT <= 0.513) {
      float segT = (localT - 0.500) / 0.013;
      return mix(vec2(0.105, -0.207), vec2(0.108, -0.207), segT);
    }
    if (localT >= 0.513 && localT <= 0.526) {
      float segT = (localT - 0.513) / 0.013;
      return mix(vec2(0.108, -0.207), vec2(0.112, -0.210), segT);
    }
    if (localT >= 0.526 && localT <= 0.539) {
      float segT = (localT - 0.526) / 0.013;
      return mix(vec2(0.112, -0.210), vec2(0.115, -0.217), segT);
    }
    if (localT >= 0.539 && localT <= 0.553) {
      float segT = (localT - 0.539) / 0.013;
      return mix(vec2(0.115, -0.217), vec2(0.118, -0.217), segT);
    }
    if (localT >= 0.553 && localT <= 0.566) {
      float segT = (localT - 0.553) / 0.013;
      return mix(vec2(0.118, -0.217), vec2(0.118, -0.220), segT);
    }
    if (localT >= 0.566 && localT <= 0.579) {
      float segT = (localT - 0.566) / 0.013;
      return mix(vec2(0.118, -0.220), vec2(0.122, -0.220), segT);
    }
    if (localT >= 0.579 && localT <= 0.592) {
      float segT = (localT - 0.579) / 0.013;
      return mix(vec2(0.122, -0.220), vec2(0.122, -0.223), segT);
    }
    if (localT >= 0.592 && localT <= 0.605) {
      float segT = (localT - 0.592) / 0.013;
      return mix(vec2(0.122, -0.223), vec2(0.118, -0.227), segT);
    }
    if (localT >= 0.605 && localT <= 0.618) {
      float segT = (localT - 0.605) / 0.013;
      return mix(vec2(0.118, -0.227), vec2(0.118, -0.230), segT);
    }
    if (localT >= 0.618 && localT <= 0.632) {
      float segT = (localT - 0.618) / 0.013;
      return mix(vec2(0.118, -0.230), vec2(0.115, -0.230), segT);
    }
    if (localT >= 0.632 && localT <= 0.645) {
      float segT = (localT - 0.632) / 0.013;
      return mix(vec2(0.115, -0.230), vec2(0.112, -0.233), segT);
    }
    if (localT >= 0.645 && localT <= 0.658) {
      float segT = (localT - 0.645) / 0.013;
      return mix(vec2(0.112, -0.233), vec2(0.108, -0.233), segT);
    }
    if (localT >= 0.658 && localT <= 0.671) {
      float segT = (localT - 0.658) / 0.013;
      return mix(vec2(0.108, -0.233), vec2(0.105, -0.233), segT);
    }
    if (localT >= 0.671 && localT <= 0.684) {
      float segT = (localT - 0.671) / 0.013;
      return mix(vec2(0.105, -0.233), vec2(0.102, -0.233), segT);
    }
    if (localT >= 0.684 && localT <= 0.697) {
      float segT = (localT - 0.684) / 0.013;
      return mix(vec2(0.102, -0.233), vec2(0.098, -0.233), segT);
    }
    if (localT >= 0.697 && localT <= 0.711) {
      float segT = (localT - 0.697) / 0.013;
      return mix(vec2(0.098, -0.233), vec2(0.095, -0.237), segT);
    }
    if (localT >= 0.711 && localT <= 0.724) {
      float segT = (localT - 0.711) / 0.013;
      return mix(vec2(0.095, -0.237), vec2(0.092, -0.237), segT);
    }
    if (localT >= 0.724 && localT <= 0.737) {
      float segT = (localT - 0.724) / 0.013;
      return mix(vec2(0.092, -0.237), vec2(0.088, -0.240), segT);
    }
    if (localT >= 0.737 && localT <= 0.750) {
      float segT = (localT - 0.737) / 0.013;
      return mix(vec2(0.088, -0.240), vec2(0.085, -0.247), segT);
    }
    if (localT >= 0.750 && localT <= 0.763) {
      float segT = (localT - 0.750) / 0.013;
      return mix(vec2(0.085, -0.247), vec2(0.085, -0.250), segT);
    }
    if (localT >= 0.763 && localT <= 0.776) {
      float segT = (localT - 0.763) / 0.013;
      return mix(vec2(0.085, -0.250), vec2(0.082, -0.253), segT);
    }
    if (localT >= 0.776 && localT <= 0.789) {
      float segT = (localT - 0.776) / 0.013;
      return mix(vec2(0.082, -0.253), vec2(0.078, -0.260), segT);
    }
    if (localT >= 0.789 && localT <= 0.803) {
      float segT = (localT - 0.789) / 0.013;
      return mix(vec2(0.078, -0.260), vec2(0.078, -0.267), segT);
    }
    if (localT >= 0.803 && localT <= 0.816) {
      float segT = (localT - 0.803) / 0.013;
      return mix(vec2(0.078, -0.267), vec2(0.078, -0.280), segT);
    }
    if (localT >= 0.816 && localT <= 0.829) {
      float segT = (localT - 0.816) / 0.013;
      return mix(vec2(0.078, -0.280), vec2(0.078, -0.290), segT);
    }
    if (localT >= 0.829 && localT <= 0.842) {
      float segT = (localT - 0.829) / 0.013;
      return mix(vec2(0.078, -0.290), vec2(0.078, -0.303), segT);
    }
    if (localT >= 0.842 && localT <= 0.855) {
      float segT = (localT - 0.842) / 0.013;
      return mix(vec2(0.078, -0.303), vec2(0.078, -0.317), segT);
    }
    if (localT >= 0.855 && localT <= 0.868) {
      float segT = (localT - 0.855) / 0.013;
      return mix(vec2(0.078, -0.317), vec2(0.078, -0.337), segT);
    }
    if (localT >= 0.868 && localT <= 0.882) {
      float segT = (localT - 0.868) / 0.013;
      return mix(vec2(0.078, -0.337), vec2(0.082, -0.347), segT);
    }
    if (localT >= 0.882 && localT <= 0.895) {
      float segT = (localT - 0.882) / 0.013;
      return mix(vec2(0.082, -0.347), vec2(0.085, -0.360), segT);
    }
    if (localT >= 0.895 && localT <= 0.908) {
      float segT = (localT - 0.895) / 0.013;
      return mix(vec2(0.085, -0.360), vec2(0.095, -0.390), segT);
    }
    if (localT >= 0.908 && localT <= 0.921) {
      float segT = (localT - 0.908) / 0.013;
      return mix(vec2(0.095, -0.390), vec2(0.095, -0.403), segT);
    }
    if (localT >= 0.921 && localT <= 0.934) {
      float segT = (localT - 0.921) / 0.013;
      return mix(vec2(0.095, -0.403), vec2(0.098, -0.437), segT);
    }
    if (localT >= 0.934 && localT <= 0.947) {
      float segT = (localT - 0.934) / 0.013;
      return mix(vec2(0.098, -0.437), vec2(0.098, -0.457), segT);
    }
    if (localT >= 0.947 && localT <= 0.961) {
      float segT = (localT - 0.947) / 0.013;
      return mix(vec2(0.098, -0.457), vec2(0.098, -0.480), segT);
    }
    if (localT >= 0.961 && localT <= 0.974) {
      float segT = (localT - 0.961) / 0.013;
      return mix(vec2(0.098, -0.480), vec2(0.098, -0.487), segT);
    }
    if (localT >= 0.974 && localT <= 0.987) {
      float segT = (localT - 0.974) / 0.013;
      return mix(vec2(0.098, -0.487), vec2(0.102, -0.493), segT);
    }
    if (localT >= 0.987 && localT <= 1.000) {
      float segT = (localT - 0.987) / 0.013;
      return mix(vec2(0.102, -0.493), vec2(0.102, -0.497), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 8) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.007) {
      float segT = (localT - 0.000) / 0.007;
      return mix(vec2(0.185, -0.093), vec2(0.185, -0.097), segT);
    }
    if (localT >= 0.007 && localT <= 0.014) {
      float segT = (localT - 0.007) / 0.007;
      return mix(vec2(0.185, -0.097), vec2(0.185, -0.103), segT);
    }
    if (localT >= 0.014 && localT <= 0.021) {
      float segT = (localT - 0.014) / 0.007;
      return mix(vec2(0.185, -0.103), vec2(0.185, -0.120), segT);
    }
    if (localT >= 0.021 && localT <= 0.029) {
      float segT = (localT - 0.021) / 0.007;
      return mix(vec2(0.185, -0.120), vec2(0.185, -0.130), segT);
    }
    if (localT >= 0.029 && localT <= 0.036) {
      float segT = (localT - 0.029) / 0.007;
      return mix(vec2(0.185, -0.130), vec2(0.185, -0.153), segT);
    }
    if (localT >= 0.036 && localT <= 0.043) {
      float segT = (localT - 0.036) / 0.007;
      return mix(vec2(0.185, -0.153), vec2(0.182, -0.167), segT);
    }
    if (localT >= 0.043 && localT <= 0.050) {
      float segT = (localT - 0.043) / 0.007;
      return mix(vec2(0.182, -0.167), vec2(0.182, -0.200), segT);
    }
    if (localT >= 0.050 && localT <= 0.057) {
      float segT = (localT - 0.050) / 0.007;
      return mix(vec2(0.182, -0.200), vec2(0.182, -0.210), segT);
    }
    if (localT >= 0.057 && localT <= 0.064) {
      float segT = (localT - 0.057) / 0.007;
      return mix(vec2(0.182, -0.210), vec2(0.182, -0.217), segT);
    }
    if (localT >= 0.064 && localT <= 0.071) {
      float segT = (localT - 0.064) / 0.007;
      return mix(vec2(0.182, -0.217), vec2(0.182, -0.223), segT);
    }
    if (localT >= 0.071 && localT <= 0.079) {
      float segT = (localT - 0.071) / 0.007;
      return mix(vec2(0.182, -0.223), vec2(0.182, -0.230), segT);
    }
    if (localT >= 0.079 && localT <= 0.086) {
      float segT = (localT - 0.079) / 0.007;
      return mix(vec2(0.182, -0.230), vec2(0.182, -0.233), segT);
    }
    if (localT >= 0.086 && localT <= 0.093) {
      float segT = (localT - 0.086) / 0.007;
      return mix(vec2(0.182, -0.233), vec2(0.182, -0.240), segT);
    }
    if (localT >= 0.093 && localT <= 0.100) {
      float segT = (localT - 0.093) / 0.007;
      return mix(vec2(0.182, -0.240), vec2(0.182, -0.250), segT);
    }
    if (localT >= 0.100 && localT <= 0.107) {
      float segT = (localT - 0.100) / 0.007;
      return mix(vec2(0.182, -0.250), vec2(0.182, -0.257), segT);
    }
    if (localT >= 0.107 && localT <= 0.114) {
      float segT = (localT - 0.107) / 0.007;
      return mix(vec2(0.182, -0.257), vec2(0.182, -0.263), segT);
    }
    if (localT >= 0.114 && localT <= 0.121) {
      float segT = (localT - 0.114) / 0.007;
      return mix(vec2(0.182, -0.263), vec2(0.182, -0.270), segT);
    }
    if (localT >= 0.121 && localT <= 0.129) {
      float segT = (localT - 0.121) / 0.007;
      return mix(vec2(0.182, -0.270), vec2(0.182, -0.277), segT);
    }
    if (localT >= 0.129 && localT <= 0.136) {
      float segT = (localT - 0.129) / 0.007;
      return mix(vec2(0.182, -0.277), vec2(0.182, -0.280), segT);
    }
    if (localT >= 0.136 && localT <= 0.143) {
      float segT = (localT - 0.136) / 0.007;
      return mix(vec2(0.182, -0.280), vec2(0.182, -0.287), segT);
    }
    if (localT >= 0.143 && localT <= 0.150) {
      float segT = (localT - 0.143) / 0.007;
      return mix(vec2(0.182, -0.287), vec2(0.182, -0.293), segT);
    }
    if (localT >= 0.150 && localT <= 0.157) {
      float segT = (localT - 0.150) / 0.007;
      return mix(vec2(0.182, -0.293), vec2(0.182, -0.303), segT);
    }
    if (localT >= 0.157 && localT <= 0.164) {
      float segT = (localT - 0.157) / 0.007;
      return mix(vec2(0.182, -0.303), vec2(0.182, -0.307), segT);
    }
    if (localT >= 0.164 && localT <= 0.171) {
      float segT = (localT - 0.164) / 0.007;
      return mix(vec2(0.182, -0.307), vec2(0.182, -0.313), segT);
    }
    if (localT >= 0.171 && localT <= 0.179) {
      float segT = (localT - 0.171) / 0.007;
      return mix(vec2(0.182, -0.313), vec2(0.182, -0.320), segT);
    }
    if (localT >= 0.179 && localT <= 0.186) {
      float segT = (localT - 0.179) / 0.007;
      return mix(vec2(0.182, -0.320), vec2(0.182, -0.330), segT);
    }
    if (localT >= 0.186 && localT <= 0.193) {
      float segT = (localT - 0.186) / 0.007;
      return mix(vec2(0.182, -0.330), vec2(0.182, -0.333), segT);
    }
    if (localT >= 0.193 && localT <= 0.200) {
      float segT = (localT - 0.193) / 0.007;
      return mix(vec2(0.182, -0.333), vec2(0.182, -0.353), segT);
    }
    if (localT >= 0.200 && localT <= 0.207) {
      float segT = (localT - 0.200) / 0.007;
      return mix(vec2(0.182, -0.353), vec2(0.182, -0.357), segT);
    }
    if (localT >= 0.207 && localT <= 0.214) {
      float segT = (localT - 0.207) / 0.007;
      return mix(vec2(0.182, -0.357), vec2(0.182, -0.363), segT);
    }
    if (localT >= 0.214 && localT <= 0.221) {
      float segT = (localT - 0.214) / 0.007;
      return mix(vec2(0.182, -0.363), vec2(0.182, -0.370), segT);
    }
    if (localT >= 0.221 && localT <= 0.229) {
      float segT = (localT - 0.221) / 0.007;
      return mix(vec2(0.182, -0.370), vec2(0.182, -0.373), segT);
    }
    if (localT >= 0.229 && localT <= 0.236) {
      float segT = (localT - 0.229) / 0.007;
      return mix(vec2(0.182, -0.373), vec2(0.182, -0.380), segT);
    }
    if (localT >= 0.236 && localT <= 0.243) {
      float segT = (localT - 0.236) / 0.007;
      return mix(vec2(0.182, -0.380), vec2(0.182, -0.383), segT);
    }
    if (localT >= 0.243 && localT <= 0.250) {
      float segT = (localT - 0.243) / 0.007;
      return mix(vec2(0.182, -0.383), vec2(0.182, -0.387), segT);
    }
    if (localT >= 0.250 && localT <= 0.257) {
      float segT = (localT - 0.250) / 0.007;
      return mix(vec2(0.182, -0.387), vec2(0.182, -0.393), segT);
    }
    if (localT >= 0.257 && localT <= 0.264) {
      float segT = (localT - 0.257) / 0.007;
      return mix(vec2(0.182, -0.393), vec2(0.182, -0.400), segT);
    }
    if (localT >= 0.264 && localT <= 0.271) {
      float segT = (localT - 0.264) / 0.007;
      return mix(vec2(0.182, -0.400), vec2(0.182, -0.403), segT);
    }
    if (localT >= 0.271 && localT <= 0.279) {
      float segT = (localT - 0.271) / 0.007;
      return mix(vec2(0.182, -0.403), vec2(0.182, -0.410), segT);
    }
    if (localT >= 0.279 && localT <= 0.286) {
      float segT = (localT - 0.279) / 0.007;
      return mix(vec2(0.182, -0.410), vec2(0.182, -0.413), segT);
    }
    if (localT >= 0.286 && localT <= 0.293) {
      float segT = (localT - 0.286) / 0.007;
      return mix(vec2(0.182, -0.413), vec2(0.182, -0.417), segT);
    }
    if (localT >= 0.293 && localT <= 0.300) {
      float segT = (localT - 0.293) / 0.007;
      return mix(vec2(0.182, -0.417), vec2(0.182, -0.423), segT);
    }
    if (localT >= 0.300 && localT <= 0.307) {
      float segT = (localT - 0.300) / 0.007;
      return mix(vec2(0.182, -0.423), vec2(0.182, -0.427), segT);
    }
    if (localT >= 0.307 && localT <= 0.314) {
      float segT = (localT - 0.307) / 0.007;
      return mix(vec2(0.182, -0.427), vec2(0.178, -0.430), segT);
    }
    if (localT >= 0.314 && localT <= 0.321) {
      float segT = (localT - 0.314) / 0.007;
      return mix(vec2(0.178, -0.430), vec2(0.178, -0.437), segT);
    }
    if (localT >= 0.321 && localT <= 0.329) {
      float segT = (localT - 0.321) / 0.007;
      return mix(vec2(0.178, -0.437), vec2(0.175, -0.440), segT);
    }
    if (localT >= 0.329 && localT <= 0.336) {
      float segT = (localT - 0.329) / 0.007;
      return mix(vec2(0.175, -0.440), vec2(0.175, -0.443), segT);
    }
    if (localT >= 0.336 && localT <= 0.343) {
      float segT = (localT - 0.336) / 0.007;
      return mix(vec2(0.175, -0.443), vec2(0.175, -0.447), segT);
    }
    if (localT >= 0.343 && localT <= 0.350) {
      float segT = (localT - 0.343) / 0.007;
      return mix(vec2(0.175, -0.447), vec2(0.175, -0.450), segT);
    }
    if (localT >= 0.350 && localT <= 0.357) {
      float segT = (localT - 0.350) / 0.007;
      return mix(vec2(0.175, -0.450), vec2(0.175, -0.453), segT);
    }
    if (localT >= 0.357 && localT <= 0.364) {
      float segT = (localT - 0.357) / 0.007;
      return mix(vec2(0.175, -0.453), vec2(0.172, -0.453), segT);
    }
    if (localT >= 0.364 && localT <= 0.371) {
      float segT = (localT - 0.364) / 0.007;
      return mix(vec2(0.172, -0.453), vec2(0.168, -0.453), segT);
    }
    if (localT >= 0.371 && localT <= 0.379) {
      float segT = (localT - 0.371) / 0.007;
      return mix(vec2(0.168, -0.453), vec2(0.168, -0.450), segT);
    }
    if (localT >= 0.379 && localT <= 0.386) {
      float segT = (localT - 0.379) / 0.007;
      return mix(vec2(0.168, -0.450), vec2(0.165, -0.450), segT);
    }
    if (localT >= 0.386 && localT <= 0.393) {
      float segT = (localT - 0.386) / 0.007;
      return mix(vec2(0.165, -0.450), vec2(0.162, -0.447), segT);
    }
    if (localT >= 0.393 && localT <= 0.400) {
      float segT = (localT - 0.393) / 0.007;
      return mix(vec2(0.162, -0.447), vec2(0.158, -0.443), segT);
    }
    if (localT >= 0.400 && localT <= 0.407) {
      float segT = (localT - 0.400) / 0.007;
      return mix(vec2(0.158, -0.443), vec2(0.162, -0.443), segT);
    }
    if (localT >= 0.407 && localT <= 0.414) {
      float segT = (localT - 0.407) / 0.007;
      return mix(vec2(0.162, -0.443), vec2(0.165, -0.443), segT);
    }
    if (localT >= 0.414 && localT <= 0.421) {
      float segT = (localT - 0.414) / 0.007;
      return mix(vec2(0.165, -0.443), vec2(0.168, -0.443), segT);
    }
    if (localT >= 0.421 && localT <= 0.429) {
      float segT = (localT - 0.421) / 0.007;
      return mix(vec2(0.168, -0.443), vec2(0.172, -0.443), segT);
    }
    if (localT >= 0.429 && localT <= 0.436) {
      float segT = (localT - 0.429) / 0.007;
      return mix(vec2(0.172, -0.443), vec2(0.178, -0.443), segT);
    }
    if (localT >= 0.436 && localT <= 0.443) {
      float segT = (localT - 0.436) / 0.007;
      return mix(vec2(0.178, -0.443), vec2(0.182, -0.443), segT);
    }
    if (localT >= 0.443 && localT <= 0.450) {
      float segT = (localT - 0.443) / 0.007;
      return mix(vec2(0.182, -0.443), vec2(0.185, -0.443), segT);
    }
    if (localT >= 0.450 && localT <= 0.457) {
      float segT = (localT - 0.450) / 0.007;
      return mix(vec2(0.185, -0.443), vec2(0.188, -0.443), segT);
    }
    if (localT >= 0.457 && localT <= 0.464) {
      float segT = (localT - 0.457) / 0.007;
      return mix(vec2(0.188, -0.443), vec2(0.192, -0.443), segT);
    }
    if (localT >= 0.464 && localT <= 0.471) {
      float segT = (localT - 0.464) / 0.007;
      return mix(vec2(0.192, -0.443), vec2(0.195, -0.443), segT);
    }
    if (localT >= 0.471 && localT <= 0.479) {
      float segT = (localT - 0.471) / 0.007;
      return mix(vec2(0.195, -0.443), vec2(0.202, -0.443), segT);
    }
    if (localT >= 0.479 && localT <= 0.486) {
      float segT = (localT - 0.479) / 0.007;
      return mix(vec2(0.202, -0.443), vec2(0.205, -0.443), segT);
    }
    if (localT >= 0.486 && localT <= 0.493) {
      float segT = (localT - 0.486) / 0.007;
      return mix(vec2(0.205, -0.443), vec2(0.205, -0.440), segT);
    }
    if (localT >= 0.493 && localT <= 0.500) {
      float segT = (localT - 0.493) / 0.007;
      return mix(vec2(0.205, -0.440), vec2(0.218, -0.440), segT);
    }
    if (localT >= 0.500 && localT <= 0.507) {
      float segT = (localT - 0.500) / 0.007;
      return mix(vec2(0.218, -0.440), vec2(0.225, -0.437), segT);
    }
    if (localT >= 0.507 && localT <= 0.514) {
      float segT = (localT - 0.507) / 0.007;
      return mix(vec2(0.225, -0.437), vec2(0.228, -0.437), segT);
    }
    if (localT >= 0.514 && localT <= 0.521) {
      float segT = (localT - 0.514) / 0.007;
      return mix(vec2(0.228, -0.437), vec2(0.232, -0.433), segT);
    }
    if (localT >= 0.521 && localT <= 0.529) {
      float segT = (localT - 0.521) / 0.007;
      return mix(vec2(0.232, -0.433), vec2(0.235, -0.433), segT);
    }
    if (localT >= 0.529 && localT <= 0.536) {
      float segT = (localT - 0.529) / 0.007;
      return mix(vec2(0.235, -0.433), vec2(0.238, -0.433), segT);
    }
    if (localT >= 0.536 && localT <= 0.543) {
      float segT = (localT - 0.536) / 0.007;
      return mix(vec2(0.238, -0.433), vec2(0.245, -0.430), segT);
    }
    if (localT >= 0.543 && localT <= 0.550) {
      float segT = (localT - 0.543) / 0.007;
      return mix(vec2(0.245, -0.430), vec2(0.248, -0.427), segT);
    }
    if (localT >= 0.550 && localT <= 0.557) {
      float segT = (localT - 0.550) / 0.007;
      return mix(vec2(0.248, -0.427), vec2(0.255, -0.420), segT);
    }
    if (localT >= 0.557 && localT <= 0.564) {
      float segT = (localT - 0.557) / 0.007;
      return mix(vec2(0.255, -0.420), vec2(0.258, -0.417), segT);
    }
    if (localT >= 0.564 && localT <= 0.571) {
      float segT = (localT - 0.564) / 0.007;
      return mix(vec2(0.258, -0.417), vec2(0.262, -0.413), segT);
    }
    if (localT >= 0.571 && localT <= 0.579) {
      float segT = (localT - 0.571) / 0.007;
      return mix(vec2(0.262, -0.413), vec2(0.268, -0.407), segT);
    }
    if (localT >= 0.579 && localT <= 0.586) {
      float segT = (localT - 0.579) / 0.007;
      return mix(vec2(0.268, -0.407), vec2(0.275, -0.403), segT);
    }
    if (localT >= 0.586 && localT <= 0.593) {
      float segT = (localT - 0.586) / 0.007;
      return mix(vec2(0.275, -0.403), vec2(0.282, -0.397), segT);
    }
    if (localT >= 0.593 && localT <= 0.600) {
      float segT = (localT - 0.593) / 0.007;
      return mix(vec2(0.282, -0.397), vec2(0.285, -0.393), segT);
    }
    if (localT >= 0.600 && localT <= 0.607) {
      float segT = (localT - 0.600) / 0.007;
      return mix(vec2(0.285, -0.393), vec2(0.292, -0.387), segT);
    }
    if (localT >= 0.607 && localT <= 0.614) {
      float segT = (localT - 0.607) / 0.007;
      return mix(vec2(0.292, -0.387), vec2(0.295, -0.380), segT);
    }
    if (localT >= 0.614 && localT <= 0.621) {
      float segT = (localT - 0.614) / 0.007;
      return mix(vec2(0.295, -0.380), vec2(0.298, -0.373), segT);
    }
    if (localT >= 0.621 && localT <= 0.629) {
      float segT = (localT - 0.621) / 0.007;
      return mix(vec2(0.298, -0.373), vec2(0.298, -0.370), segT);
    }
    if (localT >= 0.629 && localT <= 0.636) {
      float segT = (localT - 0.629) / 0.007;
      return mix(vec2(0.298, -0.370), vec2(0.302, -0.363), segT);
    }
    if (localT >= 0.636 && localT <= 0.643) {
      float segT = (localT - 0.636) / 0.007;
      return mix(vec2(0.302, -0.363), vec2(0.302, -0.357), segT);
    }
    if (localT >= 0.643 && localT <= 0.650) {
      float segT = (localT - 0.643) / 0.007;
      return mix(vec2(0.302, -0.357), vec2(0.305, -0.353), segT);
    }
    if (localT >= 0.650 && localT <= 0.657) {
      float segT = (localT - 0.650) / 0.007;
      return mix(vec2(0.305, -0.353), vec2(0.312, -0.327), segT);
    }
    if (localT >= 0.657 && localT <= 0.664) {
      float segT = (localT - 0.657) / 0.007;
      return mix(vec2(0.312, -0.327), vec2(0.312, -0.320), segT);
    }
    if (localT >= 0.664 && localT <= 0.671) {
      float segT = (localT - 0.664) / 0.007;
      return mix(vec2(0.312, -0.320), vec2(0.318, -0.293), segT);
    }
    if (localT >= 0.671 && localT <= 0.679) {
      float segT = (localT - 0.671) / 0.007;
      return mix(vec2(0.318, -0.293), vec2(0.322, -0.287), segT);
    }
    if (localT >= 0.679 && localT <= 0.686) {
      float segT = (localT - 0.679) / 0.007;
      return mix(vec2(0.322, -0.287), vec2(0.322, -0.273), segT);
    }
    if (localT >= 0.686 && localT <= 0.693) {
      float segT = (localT - 0.686) / 0.007;
      return mix(vec2(0.322, -0.273), vec2(0.322, -0.267), segT);
    }
    if (localT >= 0.693 && localT <= 0.700) {
      float segT = (localT - 0.693) / 0.007;
      return mix(vec2(0.322, -0.267), vec2(0.318, -0.257), segT);
    }
    if (localT >= 0.700 && localT <= 0.707) {
      float segT = (localT - 0.700) / 0.007;
      return mix(vec2(0.318, -0.257), vec2(0.318, -0.250), segT);
    }
    if (localT >= 0.707 && localT <= 0.714) {
      float segT = (localT - 0.707) / 0.007;
      return mix(vec2(0.318, -0.250), vec2(0.315, -0.230), segT);
    }
    if (localT >= 0.714 && localT <= 0.721) {
      float segT = (localT - 0.714) / 0.007;
      return mix(vec2(0.315, -0.230), vec2(0.315, -0.220), segT);
    }
    if (localT >= 0.721 && localT <= 0.729) {
      float segT = (localT - 0.721) / 0.007;
      return mix(vec2(0.315, -0.220), vec2(0.312, -0.197), segT);
    }
    if (localT >= 0.729 && localT <= 0.736) {
      float segT = (localT - 0.729) / 0.007;
      return mix(vec2(0.312, -0.197), vec2(0.312, -0.190), segT);
    }
    if (localT >= 0.736 && localT <= 0.743) {
      float segT = (localT - 0.736) / 0.007;
      return mix(vec2(0.312, -0.190), vec2(0.312, -0.183), segT);
    }
    if (localT >= 0.743 && localT <= 0.750) {
      float segT = (localT - 0.743) / 0.007;
      return mix(vec2(0.312, -0.183), vec2(0.312, -0.180), segT);
    }
    if (localT >= 0.750 && localT <= 0.757) {
      float segT = (localT - 0.750) / 0.007;
      return mix(vec2(0.312, -0.180), vec2(0.312, -0.177), segT);
    }
    if (localT >= 0.757 && localT <= 0.764) {
      float segT = (localT - 0.757) / 0.007;
      return mix(vec2(0.312, -0.177), vec2(0.312, -0.173), segT);
    }
    if (localT >= 0.764 && localT <= 0.771) {
      float segT = (localT - 0.764) / 0.007;
      return mix(vec2(0.312, -0.173), vec2(0.312, -0.167), segT);
    }
    if (localT >= 0.771 && localT <= 0.779) {
      float segT = (localT - 0.771) / 0.007;
      return mix(vec2(0.312, -0.167), vec2(0.312, -0.163), segT);
    }
    if (localT >= 0.779 && localT <= 0.786) {
      float segT = (localT - 0.779) / 0.007;
      return mix(vec2(0.312, -0.163), vec2(0.308, -0.160), segT);
    }
    if (localT >= 0.786 && localT <= 0.793) {
      float segT = (localT - 0.786) / 0.007;
      return mix(vec2(0.308, -0.160), vec2(0.308, -0.157), segT);
    }
    if (localT >= 0.793 && localT <= 0.800) {
      float segT = (localT - 0.793) / 0.007;
      return mix(vec2(0.308, -0.157), vec2(0.308, -0.150), segT);
    }
    if (localT >= 0.800 && localT <= 0.807) {
      float segT = (localT - 0.800) / 0.007;
      return mix(vec2(0.308, -0.150), vec2(0.302, -0.147), segT);
    }
    if (localT >= 0.807 && localT <= 0.814) {
      float segT = (localT - 0.807) / 0.007;
      return mix(vec2(0.302, -0.147), vec2(0.302, -0.143), segT);
    }
    if (localT >= 0.814 && localT <= 0.821) {
      float segT = (localT - 0.814) / 0.007;
      return mix(vec2(0.302, -0.143), vec2(0.298, -0.143), segT);
    }
    if (localT >= 0.821 && localT <= 0.829) {
      float segT = (localT - 0.821) / 0.007;
      return mix(vec2(0.298, -0.143), vec2(0.288, -0.123), segT);
    }
    if (localT >= 0.829 && localT <= 0.836) {
      float segT = (localT - 0.829) / 0.007;
      return mix(vec2(0.288, -0.123), vec2(0.282, -0.113), segT);
    }
    if (localT >= 0.836 && localT <= 0.843) {
      float segT = (localT - 0.836) / 0.007;
      return mix(vec2(0.282, -0.113), vec2(0.255, -0.087), segT);
    }
    if (localT >= 0.843 && localT <= 0.850) {
      float segT = (localT - 0.843) / 0.007;
      return mix(vec2(0.255, -0.087), vec2(0.248, -0.083), segT);
    }
    if (localT >= 0.850 && localT <= 0.857) {
      float segT = (localT - 0.850) / 0.007;
      return mix(vec2(0.248, -0.083), vec2(0.238, -0.080), segT);
    }
    if (localT >= 0.857 && localT <= 0.864) {
      float segT = (localT - 0.857) / 0.007;
      return mix(vec2(0.238, -0.080), vec2(0.222, -0.070), segT);
    }
    if (localT >= 0.864 && localT <= 0.871) {
      float segT = (localT - 0.864) / 0.007;
      return mix(vec2(0.222, -0.070), vec2(0.215, -0.070), segT);
    }
    if (localT >= 0.871 && localT <= 0.879) {
      float segT = (localT - 0.871) / 0.007;
      return mix(vec2(0.215, -0.070), vec2(0.198, -0.063), segT);
    }
    if (localT >= 0.879 && localT <= 0.886) {
      float segT = (localT - 0.879) / 0.007;
      return mix(vec2(0.198, -0.063), vec2(0.195, -0.063), segT);
    }
    if (localT >= 0.886 && localT <= 0.893) {
      float segT = (localT - 0.886) / 0.007;
      return mix(vec2(0.195, -0.063), vec2(0.192, -0.060), segT);
    }
    if (localT >= 0.893 && localT <= 0.900) {
      float segT = (localT - 0.893) / 0.007;
      return mix(vec2(0.192, -0.060), vec2(0.188, -0.060), segT);
    }
    if (localT >= 0.900 && localT <= 0.907) {
      float segT = (localT - 0.900) / 0.007;
      return mix(vec2(0.188, -0.060), vec2(0.185, -0.057), segT);
    }
    if (localT >= 0.907 && localT <= 0.914) {
      float segT = (localT - 0.907) / 0.007;
      return mix(vec2(0.185, -0.057), vec2(0.182, -0.057), segT);
    }
    if (localT >= 0.914 && localT <= 0.921) {
      float segT = (localT - 0.914) / 0.007;
      return mix(vec2(0.182, -0.057), vec2(0.175, -0.057), segT);
    }
    if (localT >= 0.921 && localT <= 0.929) {
      float segT = (localT - 0.921) / 0.007;
      return mix(vec2(0.175, -0.057), vec2(0.172, -0.057), segT);
    }
    if (localT >= 0.929 && localT <= 0.936) {
      float segT = (localT - 0.929) / 0.007;
      return mix(vec2(0.172, -0.057), vec2(0.165, -0.057), segT);
    }
    if (localT >= 0.936 && localT <= 0.943) {
      float segT = (localT - 0.936) / 0.007;
      return mix(vec2(0.165, -0.057), vec2(0.162, -0.057), segT);
    }
    if (localT >= 0.943 && localT <= 0.950) {
      float segT = (localT - 0.943) / 0.007;
      return mix(vec2(0.162, -0.057), vec2(0.155, -0.057), segT);
    }
    if (localT >= 0.950 && localT <= 0.957) {
      float segT = (localT - 0.950) / 0.007;
      return mix(vec2(0.155, -0.057), vec2(0.148, -0.057), segT);
    }
    if (localT >= 0.957 && localT <= 0.964) {
      float segT = (localT - 0.957) / 0.007;
      return mix(vec2(0.148, -0.057), vec2(0.145, -0.057), segT);
    }
    if (localT >= 0.964 && localT <= 0.971) {
      float segT = (localT - 0.964) / 0.007;
      return mix(vec2(0.145, -0.057), vec2(0.142, -0.057), segT);
    }
    if (localT >= 0.971 && localT <= 0.979) {
      float segT = (localT - 0.971) / 0.007;
      return mix(vec2(0.142, -0.057), vec2(0.138, -0.053), segT);
    }
    if (localT >= 0.979 && localT <= 0.986) {
      float segT = (localT - 0.979) / 0.007;
      return mix(vec2(0.138, -0.053), vec2(0.135, -0.053), segT);
    }
    if (localT >= 0.986 && localT <= 0.993) {
      float segT = (localT - 0.986) / 0.007;
      return mix(vec2(0.135, -0.053), vec2(0.132, -0.053), segT);
    }
    if (localT >= 0.993 && localT <= 1.000) {
      float segT = (localT - 0.993) / 0.007;
      return mix(vec2(0.132, -0.053), vec2(0.125, -0.050), segT);
    }
    return vec2(0.0, 0.0);
  }

  if (index == 9) {
    float localT = fract(t);
    if (localT >= 0.000 && localT <= 0.008) {
      float segT = (localT - 0.000) / 0.008;
      return mix(vec2(0.532, -0.400), vec2(0.528, -0.400), segT);
    }
    if (localT >= 0.008 && localT <= 0.016) {
      float segT = (localT - 0.008) / 0.008;
      return mix(vec2(0.528, -0.400), vec2(0.522, -0.400), segT);
    }
    if (localT >= 0.016 && localT <= 0.024) {
      float segT = (localT - 0.016) / 0.008;
      return mix(vec2(0.522, -0.400), vec2(0.465, -0.410), segT);
    }
    if (localT >= 0.024 && localT <= 0.032) {
      float segT = (localT - 0.024) / 0.008;
      return mix(vec2(0.465, -0.410), vec2(0.448, -0.417), segT);
    }
    if (localT >= 0.032 && localT <= 0.040) {
      float segT = (localT - 0.032) / 0.008;
      return mix(vec2(0.448, -0.417), vec2(0.362, -0.433), segT);
    }
    if (localT >= 0.040 && localT <= 0.048) {
      float segT = (localT - 0.040) / 0.008;
      return mix(vec2(0.362, -0.433), vec2(0.352, -0.433), segT);
    }
    if (localT >= 0.048 && localT <= 0.056) {
      float segT = (localT - 0.048) / 0.008;
      return mix(vec2(0.352, -0.433), vec2(0.338, -0.437), segT);
    }
    if (localT >= 0.056 && localT <= 0.064) {
      float segT = (localT - 0.056) / 0.008;
      return mix(vec2(0.338, -0.437), vec2(0.328, -0.437), segT);
    }
    if (localT >= 0.064 && localT <= 0.072) {
      float segT = (localT - 0.064) / 0.008;
      return mix(vec2(0.328, -0.437), vec2(0.325, -0.437), segT);
    }
    if (localT >= 0.072 && localT <= 0.080) {
      float segT = (localT - 0.072) / 0.008;
      return mix(vec2(0.325, -0.437), vec2(0.318, -0.437), segT);
    }
    if (localT >= 0.080 && localT <= 0.088) {
      float segT = (localT - 0.080) / 0.008;
      return mix(vec2(0.318, -0.437), vec2(0.312, -0.440), segT);
    }
    if (localT >= 0.088 && localT <= 0.096) {
      float segT = (localT - 0.088) / 0.008;
      return mix(vec2(0.312, -0.440), vec2(0.305, -0.440), segT);
    }
    if (localT >= 0.096 && localT <= 0.104) {
      float segT = (localT - 0.096) / 0.008;
      return mix(vec2(0.305, -0.440), vec2(0.278, -0.447), segT);
    }
    if (localT >= 0.104 && localT <= 0.112) {
      float segT = (localT - 0.104) / 0.008;
      return mix(vec2(0.278, -0.447), vec2(0.268, -0.453), segT);
    }
    if (localT >= 0.112 && localT <= 0.120) {
      float segT = (localT - 0.112) / 0.008;
      return mix(vec2(0.268, -0.453), vec2(0.228, -0.460), segT);
    }
    if (localT >= 0.120 && localT <= 0.128) {
      float segT = (localT - 0.120) / 0.008;
      return mix(vec2(0.228, -0.460), vec2(0.225, -0.460), segT);
    }
    if (localT >= 0.128 && localT <= 0.136) {
      float segT = (localT - 0.128) / 0.008;
      return mix(vec2(0.225, -0.460), vec2(0.218, -0.460), segT);
    }
    if (localT >= 0.136 && localT <= 0.144) {
      float segT = (localT - 0.136) / 0.008;
      return mix(vec2(0.218, -0.460), vec2(0.215, -0.460), segT);
    }
    if (localT >= 0.144 && localT <= 0.152) {
      float segT = (localT - 0.144) / 0.008;
      return mix(vec2(0.215, -0.460), vec2(0.212, -0.460), segT);
    }
    if (localT >= 0.152 && localT <= 0.160) {
      float segT = (localT - 0.152) / 0.008;
      return mix(vec2(0.212, -0.460), vec2(0.208, -0.463), segT);
    }
    if (localT >= 0.160 && localT <= 0.168) {
      float segT = (localT - 0.160) / 0.008;
      return mix(vec2(0.208, -0.463), vec2(0.205, -0.463), segT);
    }
    if (localT >= 0.168 && localT <= 0.176) {
      float segT = (localT - 0.168) / 0.008;
      return mix(vec2(0.205, -0.463), vec2(0.195, -0.463), segT);
    }
    if (localT >= 0.176 && localT <= 0.184) {
      float segT = (localT - 0.176) / 0.008;
      return mix(vec2(0.195, -0.463), vec2(0.188, -0.463), segT);
    }
    if (localT >= 0.184 && localT <= 0.192) {
      float segT = (localT - 0.184) / 0.008;
      return mix(vec2(0.188, -0.463), vec2(0.182, -0.463), segT);
    }
    if (localT >= 0.192 && localT <= 0.200) {
      float segT = (localT - 0.192) / 0.008;
      return mix(vec2(0.182, -0.463), vec2(0.172, -0.463), segT);
    }
    if (localT >= 0.200 && localT <= 0.208) {
      float segT = (localT - 0.200) / 0.008;
      return mix(vec2(0.172, -0.463), vec2(0.168, -0.467), segT);
    }
    if (localT >= 0.208 && localT <= 0.216) {
      float segT = (localT - 0.208) / 0.008;
      return mix(vec2(0.168, -0.467), vec2(0.172, -0.467), segT);
    }
    if (localT >= 0.216 && localT <= 0.224) {
      float segT = (localT - 0.216) / 0.008;
      return mix(vec2(0.172, -0.467), vec2(0.178, -0.467), segT);
    }
    if (localT >= 0.224 && localT <= 0.232) {
      float segT = (localT - 0.224) / 0.008;
      return mix(vec2(0.178, -0.467), vec2(0.185, -0.463), segT);
    }
    if (localT >= 0.232 && localT <= 0.240) {
      float segT = (localT - 0.232) / 0.008;
      return mix(vec2(0.185, -0.463), vec2(0.195, -0.460), segT);
    }
    if (localT >= 0.240 && localT <= 0.248) {
      float segT = (localT - 0.240) / 0.008;
      return mix(vec2(0.195, -0.460), vec2(0.205, -0.460), segT);
    }
    if (localT >= 0.248 && localT <= 0.256) {
      float segT = (localT - 0.248) / 0.008;
      return mix(vec2(0.205, -0.460), vec2(0.212, -0.460), segT);
    }
    if (localT >= 0.256 && localT <= 0.264) {
      float segT = (localT - 0.256) / 0.008;
      return mix(vec2(0.212, -0.460), vec2(0.232, -0.457), segT);
    }
    if (localT >= 0.264 && localT <= 0.272) {
      float segT = (localT - 0.264) / 0.008;
      return mix(vec2(0.232, -0.457), vec2(0.238, -0.453), segT);
    }
    if (localT >= 0.272 && localT <= 0.280) {
      float segT = (localT - 0.272) / 0.008;
      return mix(vec2(0.238, -0.453), vec2(0.252, -0.453), segT);
    }
    if (localT >= 0.280 && localT <= 0.288) {
      float segT = (localT - 0.280) / 0.008;
      return mix(vec2(0.252, -0.453), vec2(0.255, -0.453), segT);
    }
    if (localT >= 0.288 && localT <= 0.296) {
      float segT = (localT - 0.288) / 0.008;
      return mix(vec2(0.255, -0.453), vec2(0.262, -0.453), segT);
    }
    if (localT >= 0.296 && localT <= 0.304) {
      float segT = (localT - 0.296) / 0.008;
      return mix(vec2(0.262, -0.453), vec2(0.268, -0.450), segT);
    }
    if (localT >= 0.304 && localT <= 0.312) {
      float segT = (localT - 0.304) / 0.008;
      return mix(vec2(0.268, -0.450), vec2(0.272, -0.450), segT);
    }
    if (localT >= 0.312 && localT <= 0.320) {
      float segT = (localT - 0.312) / 0.008;
      return mix(vec2(0.272, -0.450), vec2(0.278, -0.450), segT);
    }
    if (localT >= 0.320 && localT <= 0.328) {
      float segT = (localT - 0.320) / 0.008;
      return mix(vec2(0.278, -0.450), vec2(0.285, -0.447), segT);
    }
    if (localT >= 0.328 && localT <= 0.336) {
      float segT = (localT - 0.328) / 0.008;
      return mix(vec2(0.285, -0.447), vec2(0.295, -0.447), segT);
    }
    if (localT >= 0.336 && localT <= 0.344) {
      float segT = (localT - 0.336) / 0.008;
      return mix(vec2(0.295, -0.447), vec2(0.302, -0.447), segT);
    }
    if (localT >= 0.344 && localT <= 0.352) {
      float segT = (localT - 0.344) / 0.008;
      return mix(vec2(0.302, -0.447), vec2(0.305, -0.447), segT);
    }
    if (localT >= 0.352 && localT <= 0.360) {
      float segT = (localT - 0.352) / 0.008;
      return mix(vec2(0.305, -0.447), vec2(0.315, -0.443), segT);
    }
    if (localT >= 0.360 && localT <= 0.368) {
      float segT = (localT - 0.360) / 0.008;
      return mix(vec2(0.315, -0.443), vec2(0.318, -0.443), segT);
    }
    if (localT >= 0.368 && localT <= 0.376) {
      float segT = (localT - 0.368) / 0.008;
      return mix(vec2(0.318, -0.443), vec2(0.328, -0.440), segT);
    }
    if (localT >= 0.376 && localT <= 0.384) {
      float segT = (localT - 0.376) / 0.008;
      return mix(vec2(0.328, -0.440), vec2(0.332, -0.440), segT);
    }
    if (localT >= 0.384 && localT <= 0.392) {
      float segT = (localT - 0.384) / 0.008;
      return mix(vec2(0.332, -0.440), vec2(0.335, -0.440), segT);
    }
    if (localT >= 0.392 && localT <= 0.400) {
      float segT = (localT - 0.392) / 0.008;
      return mix(vec2(0.335, -0.440), vec2(0.338, -0.440), segT);
    }
    if (localT >= 0.400 && localT <= 0.408) {
      float segT = (localT - 0.400) / 0.008;
      return mix(vec2(0.338, -0.440), vec2(0.342, -0.440), segT);
    }
    if (localT >= 0.408 && localT <= 0.416) {
      float segT = (localT - 0.408) / 0.008;
      return mix(vec2(0.342, -0.440), vec2(0.342, -0.437), segT);
    }
    if (localT >= 0.416 && localT <= 0.424) {
      float segT = (localT - 0.416) / 0.008;
      return mix(vec2(0.342, -0.437), vec2(0.342, -0.443), segT);
    }
    if (localT >= 0.424 && localT <= 0.432) {
      float segT = (localT - 0.424) / 0.008;
      return mix(vec2(0.342, -0.443), vec2(0.342, -0.450), segT);
    }
    if (localT >= 0.432 && localT <= 0.440) {
      float segT = (localT - 0.432) / 0.008;
      return mix(vec2(0.342, -0.450), vec2(0.338, -0.457), segT);
    }
    if (localT >= 0.440 && localT <= 0.448) {
      float segT = (localT - 0.440) / 0.008;
      return mix(vec2(0.338, -0.457), vec2(0.335, -0.460), segT);
    }
    if (localT >= 0.448 && localT <= 0.456) {
      float segT = (localT - 0.448) / 0.008;
      return mix(vec2(0.335, -0.460), vec2(0.335, -0.470), segT);
    }
    if (localT >= 0.456 && localT <= 0.464) {
      float segT = (localT - 0.456) / 0.008;
      return mix(vec2(0.335, -0.470), vec2(0.325, -0.483), segT);
    }
    if (localT >= 0.464 && localT <= 0.472) {
      float segT = (localT - 0.464) / 0.008;
      return mix(vec2(0.325, -0.483), vec2(0.322, -0.487), segT);
    }
    if (localT >= 0.472 && localT <= 0.480) {
      float segT = (localT - 0.472) / 0.008;
      return mix(vec2(0.322, -0.487), vec2(0.322, -0.490), segT);
    }
    if (localT >= 0.480 && localT <= 0.488) {
      float segT = (localT - 0.480) / 0.008;
      return mix(vec2(0.322, -0.490), vec2(0.315, -0.493), segT);
    }
    if (localT >= 0.488 && localT <= 0.496) {
      float segT = (localT - 0.488) / 0.008;
      return mix(vec2(0.315, -0.493), vec2(0.312, -0.493), segT);
    }
    if (localT >= 0.496 && localT <= 0.504) {
      float segT = (localT - 0.496) / 0.008;
      return mix(vec2(0.312, -0.493), vec2(0.312, -0.483), segT);
    }
    if (localT >= 0.504 && localT <= 0.512) {
      float segT = (localT - 0.504) / 0.008;
      return mix(vec2(0.312, -0.483), vec2(0.315, -0.473), segT);
    }
    if (localT >= 0.512 && localT <= 0.520) {
      float segT = (localT - 0.512) / 0.008;
      return mix(vec2(0.315, -0.473), vec2(0.318, -0.467), segT);
    }
    if (localT >= 0.520 && localT <= 0.528) {
      float segT = (localT - 0.520) / 0.008;
      return mix(vec2(0.318, -0.467), vec2(0.325, -0.453), segT);
    }
    if (localT >= 0.528 && localT <= 0.536) {
      float segT = (localT - 0.528) / 0.008;
      return mix(vec2(0.325, -0.453), vec2(0.342, -0.407), segT);
    }
    if (localT >= 0.536 && localT <= 0.544) {
      float segT = (localT - 0.536) / 0.008;
      return mix(vec2(0.342, -0.407), vec2(0.345, -0.393), segT);
    }
    if (localT >= 0.544 && localT <= 0.552) {
      float segT = (localT - 0.544) / 0.008;
      return mix(vec2(0.345, -0.393), vec2(0.352, -0.360), segT);
    }
    if (localT >= 0.552 && localT <= 0.560) {
      float segT = (localT - 0.552) / 0.008;
      return mix(vec2(0.352, -0.360), vec2(0.355, -0.340), segT);
    }
    if (localT >= 0.560 && localT <= 0.568) {
      float segT = (localT - 0.560) / 0.008;
      return mix(vec2(0.355, -0.340), vec2(0.358, -0.320), segT);
    }
    if (localT >= 0.568 && localT <= 0.576) {
      float segT = (localT - 0.568) / 0.008;
      return mix(vec2(0.358, -0.320), vec2(0.362, -0.307), segT);
    }
    if (localT >= 0.576 && localT <= 0.584) {
      float segT = (localT - 0.576) / 0.008;
      return mix(vec2(0.362, -0.307), vec2(0.365, -0.300), segT);
    }
    if (localT >= 0.584 && localT <= 0.592) {
      float segT = (localT - 0.584) / 0.008;
      return mix(vec2(0.365, -0.300), vec2(0.368, -0.293), segT);
    }
    if (localT >= 0.592 && localT <= 0.600) {
      float segT = (localT - 0.592) / 0.008;
      return mix(vec2(0.368, -0.293), vec2(0.372, -0.287), segT);
    }
    if (localT >= 0.600 && localT <= 0.608) {
      float segT = (localT - 0.600) / 0.008;
      return mix(vec2(0.372, -0.287), vec2(0.375, -0.280), segT);
    }
    if (localT >= 0.608 && localT <= 0.616) {
      float segT = (localT - 0.608) / 0.008;
      return mix(vec2(0.375, -0.280), vec2(0.382, -0.267), segT);
    }
    if (localT >= 0.616 && localT <= 0.624) {
      float segT = (localT - 0.616) / 0.008;
      return mix(vec2(0.382, -0.267), vec2(0.385, -0.257), segT);
    }
    if (localT >= 0.624 && localT <= 0.632) {
      float segT = (localT - 0.624) / 0.008;
      return mix(vec2(0.385, -0.257), vec2(0.388, -0.247), segT);
    }
    if (localT >= 0.632 && localT <= 0.640) {
      float segT = (localT - 0.632) / 0.008;
      return mix(vec2(0.388, -0.247), vec2(0.398, -0.230), segT);
    }
    if (localT >= 0.640 && localT <= 0.648) {
      float segT = (localT - 0.640) / 0.008;
      return mix(vec2(0.398, -0.230), vec2(0.408, -0.210), segT);
    }
    if (localT >= 0.648 && localT <= 0.656) {
      float segT = (localT - 0.648) / 0.008;
      return mix(vec2(0.408, -0.210), vec2(0.415, -0.197), segT);
    }
    if (localT >= 0.656 && localT <= 0.664) {
      float segT = (localT - 0.656) / 0.008;
      return mix(vec2(0.415, -0.197), vec2(0.415, -0.187), segT);
    }
    if (localT >= 0.664 && localT <= 0.672) {
      float segT = (localT - 0.664) / 0.008;
      return mix(vec2(0.415, -0.187), vec2(0.415, -0.170), segT);
    }
    if (localT >= 0.672 && localT <= 0.680) {
      float segT = (localT - 0.672) / 0.008;
      return mix(vec2(0.415, -0.170), vec2(0.415, -0.163), segT);
    }
    if (localT >= 0.680 && localT <= 0.688) {
      float segT = (localT - 0.680) / 0.008;
      return mix(vec2(0.415, -0.163), vec2(0.415, -0.157), segT);
    }
    if (localT >= 0.688 && localT <= 0.696) {
      float segT = (localT - 0.688) / 0.008;
      return mix(vec2(0.415, -0.157), vec2(0.415, -0.150), segT);
    }
    if (localT >= 0.696 && localT <= 0.704) {
      float segT = (localT - 0.696) / 0.008;
      return mix(vec2(0.415, -0.150), vec2(0.415, -0.140), segT);
    }
    if (localT >= 0.704 && localT <= 0.712) {
      float segT = (localT - 0.704) / 0.008;
      return mix(vec2(0.415, -0.140), vec2(0.415, -0.123), segT);
    }
    if (localT >= 0.712 && localT <= 0.720) {
      float segT = (localT - 0.712) / 0.008;
      return mix(vec2(0.415, -0.123), vec2(0.412, -0.117), segT);
    }
    if (localT >= 0.720 && localT <= 0.728) {
      float segT = (localT - 0.720) / 0.008;
      return mix(vec2(0.412, -0.117), vec2(0.412, -0.110), segT);
    }
    if (localT >= 0.728 && localT <= 0.736) {
      float segT = (localT - 0.728) / 0.008;
      return mix(vec2(0.412, -0.110), vec2(0.412, -0.107), segT);
    }
    if (localT >= 0.736 && localT <= 0.744) {
      float segT = (localT - 0.736) / 0.008;
      return mix(vec2(0.412, -0.107), vec2(0.412, -0.093), segT);
    }
    if (localT >= 0.744 && localT <= 0.752) {
      float segT = (localT - 0.744) / 0.008;
      return mix(vec2(0.412, -0.093), vec2(0.412, -0.090), segT);
    }
    if (localT >= 0.752 && localT <= 0.760) {
      float segT = (localT - 0.752) / 0.008;
      return mix(vec2(0.412, -0.090), vec2(0.412, -0.087), segT);
    }
    if (localT >= 0.760 && localT <= 0.768) {
      float segT = (localT - 0.760) / 0.008;
      return mix(vec2(0.412, -0.087), vec2(0.412, -0.083), segT);
    }
    if (localT >= 0.768 && localT <= 0.776) {
      float segT = (localT - 0.768) / 0.008;
      return mix(vec2(0.412, -0.083), vec2(0.412, -0.080), segT);
    }
    if (localT >= 0.776 && localT <= 0.784) {
      float segT = (localT - 0.776) / 0.008;
      return mix(vec2(0.412, -0.080), vec2(0.412, -0.077), segT);
    }
    if (localT >= 0.784 && localT <= 0.792) {
      float segT = (localT - 0.784) / 0.008;
      return mix(vec2(0.412, -0.077), vec2(0.408, -0.073), segT);
    }
    if (localT >= 0.792 && localT <= 0.800) {
      float segT = (localT - 0.792) / 0.008;
      return mix(vec2(0.408, -0.073), vec2(0.408, -0.083), segT);
    }
    if (localT >= 0.800 && localT <= 0.808) {
      float segT = (localT - 0.800) / 0.008;
      return mix(vec2(0.408, -0.083), vec2(0.408, -0.093), segT);
    }
    if (localT >= 0.808 && localT <= 0.816) {
      float segT = (localT - 0.808) / 0.008;
      return mix(vec2(0.408, -0.093), vec2(0.408, -0.107), segT);
    }
    if (localT >= 0.816 && localT <= 0.824) {
      float segT = (localT - 0.816) / 0.008;
      return mix(vec2(0.408, -0.107), vec2(0.408, -0.120), segT);
    }
    if (localT >= 0.824 && localT <= 0.832) {
      float segT = (localT - 0.824) / 0.008;
      return mix(vec2(0.408, -0.120), vec2(0.412, -0.140), segT);
    }
    if (localT >= 0.832 && localT <= 0.840) {
      float segT = (localT - 0.832) / 0.008;
      return mix(vec2(0.412, -0.140), vec2(0.415, -0.160), segT);
    }
    if (localT >= 0.840 && localT <= 0.848) {
      float segT = (localT - 0.840) / 0.008;
      return mix(vec2(0.415, -0.160), vec2(0.418, -0.183), segT);
    }
    if (localT >= 0.848 && localT <= 0.856) {
      float segT = (localT - 0.848) / 0.008;
      return mix(vec2(0.418, -0.183), vec2(0.418, -0.207), segT);
    }
    if (localT >= 0.856 && localT <= 0.864) {
      float segT = (localT - 0.856) / 0.008;
      return mix(vec2(0.418, -0.207), vec2(0.425, -0.260), segT);
    }
    if (localT >= 0.864 && localT <= 0.872) {
      float segT = (localT - 0.864) / 0.008;
      return mix(vec2(0.425, -0.260), vec2(0.428, -0.287), segT);
    }
    if (localT >= 0.872 && localT <= 0.880) {
      float segT = (localT - 0.872) / 0.008;
      return mix(vec2(0.428, -0.287), vec2(0.432, -0.310), segT);
    }
    if (localT >= 0.880 && localT <= 0.888) {
      float segT = (localT - 0.880) / 0.008;
      return mix(vec2(0.432, -0.310), vec2(0.435, -0.333), segT);
    }
    if (localT >= 0.888 && localT <= 0.896) {
      float segT = (localT - 0.888) / 0.008;
      return mix(vec2(0.435, -0.333), vec2(0.438, -0.357), segT);
    }
    if (localT >= 0.896 && localT <= 0.904) {
      float segT = (localT - 0.896) / 0.008;
      return mix(vec2(0.438, -0.357), vec2(0.445, -0.393), segT);
    }
    if (localT >= 0.904 && localT <= 0.912) {
      float segT = (localT - 0.904) / 0.008;
      return mix(vec2(0.445, -0.393), vec2(0.448, -0.413), segT);
    }
    if (localT >= 0.912 && localT <= 0.920) {
      float segT = (localT - 0.912) / 0.008;
      return mix(vec2(0.448, -0.413), vec2(0.448, -0.430), segT);
    }
    if (localT >= 0.920 && localT <= 0.928) {
      float segT = (localT - 0.920) / 0.008;
      return mix(vec2(0.448, -0.430), vec2(0.462, -0.493), segT);
    }
    if (localT >= 0.928 && localT <= 0.936) {
      float segT = (localT - 0.928) / 0.008;
      return mix(vec2(0.462, -0.493), vec2(0.465, -0.507), segT);
    }
    if (localT >= 0.936 && localT <= 0.944) {
      float segT = (localT - 0.936) / 0.008;
      return mix(vec2(0.465, -0.507), vec2(0.475, -0.530), segT);
    }
    if (localT >= 0.944 && localT <= 0.952) {
      float segT = (localT - 0.944) / 0.008;
      return mix(vec2(0.475, -0.530), vec2(0.475, -0.537), segT);
    }
    if (localT >= 0.952 && localT <= 0.960) {
      float segT = (localT - 0.952) / 0.008;
      return mix(vec2(0.475, -0.537), vec2(0.482, -0.550), segT);
    }
    if (localT >= 0.960 && localT <= 0.968) {
      float segT = (localT - 0.960) / 0.008;
      return mix(vec2(0.482, -0.550), vec2(0.482, -0.553), segT);
    }
    if (localT >= 0.968 && localT <= 0.976) {
      float segT = (localT - 0.968) / 0.008;
      return mix(vec2(0.482, -0.553), vec2(0.482, -0.557), segT);
    }
    if (localT >= 0.976 && localT <= 0.984) {
      float segT = (localT - 0.976) / 0.008;
      return mix(vec2(0.482, -0.557), vec2(0.485, -0.560), segT);
    }
    if (localT >= 0.984 && localT <= 0.992) {
      float segT = (localT - 0.984) / 0.008;
      return mix(vec2(0.485, -0.560), vec2(0.485, -0.563), segT);
    }
    if (localT >= 0.992 && localT <= 1.000) {
      float segT = (localT - 0.992) / 0.008;
      return mix(vec2(0.485, -0.563), vec2(0.485, -0.567), segT);
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
