// forge-tweaks.jsx — wires the three-axis tweak panel into the page.
//
// Three controls, each reshaping the system rather than a single property:
//   voice    — crisp / serif / mono       (typography + radii)
//   chroma   — muted / default / vivid    (phase color saturation)
//   surface  — card / float / sheet       (how chrome occupies space)
//
// Tweak values land on <body> as data-* attrs; forge-tweaks.css does the rest.

(function () {
  function ForgeTweaks() {
    const t = window.FORGE_TWEAK_DEFAULTS || {
      voice: 'crisp', chroma: 'default', surface: 'card',
    };
    const [tweaks, setTweak] = useTweaks(t);

    React.useEffect(() => {
      document.body.dataset.voice = tweaks.voice;
      document.body.dataset.chroma = tweaks.chroma;
      document.body.dataset.surface = tweaks.surface;
    }, [tweaks.voice, tweaks.chroma, tweaks.surface]);

    return (
      <TweaksPanel title="Tweaks">
        <TweakSection label="Voice — what the system sounds like">
          <TweakRadio
            value={tweaks.voice}
            options={[
              { value: 'crisp', label: 'Crisp' },
              { value: 'serif', label: 'Serif' },
              { value: 'mono',  label: 'Mono'  },
            ]}
            onChange={(v) => setTweak('voice', v)} />
        </TweakSection>

        <TweakSection label="Chroma — how loud phase color speaks">
          <TweakRadio
            value={tweaks.chroma}
            options={[
              { value: 'muted',   label: 'Muted'   },
              { value: 'default', label: 'Default' },
              { value: 'vivid',   label: 'Vivid'   },
            ]}
            onChange={(v) => setTweak('chroma', v)} />
        </TweakSection>

        <TweakSection label="Surface — how chrome sits in space">
          <TweakRadio
            value={tweaks.surface}
            options={[
              { value: 'card',  label: 'Card'  },
              { value: 'float', label: 'Float' },
              { value: 'sheet', label: 'Sheet' },
            ]}
            onChange={(v) => setTweak('surface', v)} />
        </TweakSection>
      </TweaksPanel>
    );
  }

  // Mount into a dedicated root outside the design canvas so the panel
  // is positioned in the viewport, not panned/zoomed with artboards.
  const host = document.getElementById('tweaks-root');
  if (host) ReactDOM.createRoot(host).render(<ForgeTweaks />);
})();
