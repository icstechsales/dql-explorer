/**
 * Copyright (c) International Business Machines
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import java from "highlight.js/lib/languages/java";
import sql from "highlight.js/lib/languages/sql";
import vbnet from "highlight.js/lib/languages/vbnet";
import vbscript from "highlight.js/lib/languages/vbscript";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/xcode.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("vbnet", vbnet);
hljs.registerLanguage("vbscript", vbscript);
hljs.registerLanguage("bash", bash);

class CodeBlock extends React.Component {

  componentDidMount() {
    if (this.refs.dql) hljs.highlightBlock(this.refs.dql);
    if (this.refs.java) hljs.highlightBlock(this.refs.java);
    if (this.refs.javascript) hljs.highlightBlock(this.refs.javascript);
    if (this.refs.lotusscript) hljs.highlightBlock(this.refs.lotusscript);
    if (this.refs.bash) hljs.highlightBlock(this.refs.bash);
    if (this.refs.explain) hljs.highlightBlock(this.refs.explain);
  }

  render() {
    let { children, refValue, classValue } = this.props;
    return (
      <pre className='codeContainer'>
        <code ref={refValue} className={classValue}>
          {children}
        </code>
      </pre>
    );
  }
}

export default CodeBlock;
