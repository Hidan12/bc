import { useState, useRef, useEffect } from "react";

const SelectModificado = ({
  label,
  name,
  labelColor = "text-slate-400",
  labelColorSelect,
  arrayDatos,
  bgColor,
  borderColor = "border border-[#94a3b8]",
  borderColorSelect = "border border-[#94a3b8]",
  handler
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(typeof arrayDatos[0] === "object" ? arrayDatos[0].value : arrayDatos[0]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef();

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleSelect = (value) => {
    setSelectedItem(value);
    handler({ target: { name, value } });
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % arrayDatos.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? arrayDatos.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(arrayDatos[highlightedIndex]);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      className={`w-full flex flex-col relative p-4 cursor-pointer rounded outline-none ${bgColor} ${
        isOpen ? `${borderColorSelect} ${labelColorSelect}` : `${borderColor}`
      }`}
    >
      <span
        className={`absolute px-1 -top-3 bg-white text-[12px] ${
          isOpen ? labelColorSelect : labelColor
        }`}
      >
        {label}
      </span>
      <div className="w-full flex justify-between items-center">
        <span>{selectedItem}</span>
        <div className={`text-slate-500 transform transition-transform duration-300 ${!isOpen ? "rotate-180": ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div
          className={`p-3 z-20 absolute bg-white w-full left-0 top-10 flex flex-col overflow-y-auto ${bgColor} ${
            arrayDatos.length > 3 ? "max-h-[200px]" : ""
          }`}
          style={{ height: arrayDatos.length <= 3 ? `${arrayDatos.length * 60}px` : undefined }}
        >
          {arrayDatos.map((d, k) => (
            <button
              key={k}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(typeof d === "object" ? d.value : d);
              }}
              className={`text-[18px] text-start flex items-center pr-1 gap gap-x-1 py-1 px-2 rounded ${
                (typeof d === "object" && selectedItem === d.value) || d === selectedItem ? "bg-slate-200" : ""
              }`}
            >
              {typeof d === "object" ? <img className="w-4 h-4 object-contain" src={d.icon} /> : d} {typeof d === "object" ? d.string :""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { SelectModificado };
