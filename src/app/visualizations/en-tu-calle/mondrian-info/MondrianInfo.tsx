import './MondrianInfo.css';

const theRedTree = require('./assets/the-red-tree.jpg');
const grayTree = require('./assets/gray-tree.jpg');
const blossomingAppleTree = require('./assets/blossoming-apple-tree.jpg');
const compositionII = require('./assets/composition-II.jpg');
const compositionInRedYellowBlueAndBlack = require('./assets/composition-in-red-yellow-blue-and-black.jpg');

export const MondrianInfo = () => {
  return (
    <div className="mondrian-info">
      <h2>Mondrian's Journey to Abstraction</h2>
      <div className="mondrian-content">
        <p>
          Piet Mondrian (1872-1944) is renowned for his pure geometric compositions of rectangles in primary colors,
          black lines, and white backgrounds. However, his iconic abstract style was the culmination of a decades-long
          artistic evolution that can be traced through his progressive abstraction of natural forms—most notably,
          trees.
        </p>
        <p>
          Between 1908 and 1912, Mondrian created a series of tree paintings that document his systematic journey from
          naturalism to abstraction. His early tree works, like "The Red Tree" (1908), still depicted recognizable trees
          with expressionistic colors and visible brushwork. As the series progressed through "Gray Tree" (1911) and
          "Blossoming Apple Tree" (1912), the forms became increasingly simplified, with branches reduced to rhythmic
          lines and curves that emphasized structure over representation.
        </p>

        <div className="mondrian-images">
          <div className="mondrian-image-item">
            <img src={theRedTree} alt="The Red Tree (1908)" />
            <p className="image-caption">The Red Tree (1908)</p>
          </div>
          <div className="mondrian-image-item">
            <img src={grayTree} alt="Gray Tree (1911)" />
            <p className="image-caption">Gray Tree (1911)</p>
          </div>
          <div className="mondrian-image-item">
            <img src={blossomingAppleTree} alt="Blossoming Apple Tree (1912)" />
            <p className="image-caption">Blossoming Apple Tree (1912)</p>
          </div>
        </div>

        <p>
          By the time of "Composition Trees II" (1912-1913), the tree had been almost entirely abstracted into a network
          of horizontal and vertical lines with subtle curves. This transformation reflected Mondrian's philosophical
          pursuit of universal harmony and spiritual truth, which he believed existed beyond the visible world. He
          sought to express the essential, underlying structure of nature rather than its superficial appearance.
        </p>
        <p>
          This process of abstraction eventually led Mondrian to completely eliminate curved lines and representational
          elements, arriving at his signature Neo-Plastic style by 1920—a pure visual language of perpendicular lines
          and primary colors. The tree series thus serves as a bridge between traditional representation and pure
          abstraction, revealing how Mondrian distilled the essence of natural forms into fundamental geometric
          principles.
        </p>

        <div className="mondrian-images">
          <div className="mondrian-image-item">
            <img src={compositionII} alt="Composition II (1920)" />
            <p className="image-caption">Composition II (1920)</p>
          </div>
          <div className="mondrian-image-item">
            <img src={compositionInRedYellowBlueAndBlack} alt="Composition in Red, Yellow, Blue and Black (1921)" />
            <p className="image-caption">Composition in Red, Yellow, Blue and Black (1921)</p>
          </div>
        </div>

        <div className="mondrian-action">
          <a
            href="https://tmunz.github.io/Mondrian/"
            target="_blank"
            rel="noopener noreferrer"
            className="mondrian-button"
          >
            Create Your Own Mondrian
          </a>
        </div>
      </div>
    </div>
  );
};
