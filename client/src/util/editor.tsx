import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/ext-language_tools";

export type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  baseValue?: string;
  indent?: number;
  disabled?: boolean;
};

const DISABLED_STYLE: React.CSSProperties = {
  opacity: 0.75,
  pointerEvents: "none",
};

export const Editor = (props: EditorProps) => {
  return (
    <AceEditor
      placeholder={props.baseValue}
      mode="json"
      // Para cambiar el theme actualizar el import arriba.
      // Ver https://github.com/ajaxorg/ace-builds/tree/master/src-noconflict
      // y https://ace.c9.io/build/kitchen-sink.html
      theme="tomorrow_night"
      onChange={(v: string) => props.onChange(v)}
      value={props.value}
      width="80%"
      showPrintMargin={false}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      tabSize={props.indent}
      readOnly={props.disabled}
      style={props.disabled ? DISABLED_STYLE : undefined}
      setOptions={{
        useWorker: false,
        cursorStyle: "slim",
      }}
    />
  );
};
