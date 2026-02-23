import './ZoetropeInfo.css';

export const ZoetropeInfo = () => {
  return (
    <div className="zoetrope-info">
      <h2>Zoetrope Effect</h2>
      <div className="zoetrope-content">
        <p>
          A 'Zoetrope' is a pre-film animation device invented in 1834. It consists of a cylinder with slits cut
          vertically in the sides. Inside the cylinder is a sequence of images on the opposite side of the slits. As the
          cylinder rotates, viewers look through the slits at the images on the opposite side, creating the illusion of
          motion.
        </p>
        <p>
          The slits provided a stroboscopic effect, which is the optical phenomenon that makes the zoetrope work. When a
          series of still images depicting phases of motion are viewed in rapid succession through intermittent viewing
          (via the slits), they create the perception of smooth, continuous movement. This effect occurs because the
          human eye retains an image for a brief moment after it disappears, a phenomenon called persistence of vision.
        </p>
        <p>
          The timing is crucial: the rotational speed must be synchronized with the viewing rate through the slits. If
          the frequency is too fast or too slow, the illusion breaks down. When properly calibrated, each successive
          image appears in roughly the same position, creating seamless animation. This same principle later became
          fundamental to motion pictures and modern video displays, and can also be used as in this case to imitate
          motion on vinyl records.
        </p>
      </div>
    </div>
  );
};
