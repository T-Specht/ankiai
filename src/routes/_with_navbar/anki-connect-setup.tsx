import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { invokeAnki } from "../../utils/anki";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_with_navbar/anki-connect-setup")({
  component: Index,
});

function Index() {
  const ankiRequestPermission = useMutation({
    mutationFn: () => {
      return invokeAnki("requestPermission");
    },
  });

  const host = `${location.protocol}//${location.host}`;

  return (
    <div className="prose dark:prose-invert mx-auto">
      <h2>AnkiConnect Setup</h2>
      <p>
        AnkiAI uses AnkiConnect to add cards to Anki. For this, you need to
        install Anki, the AnkiConnect plugin and Anki needs to be open.
      </p>
      <ol>
        <li>
          <a href="https://apps.ankiweb.net/" target="_blank">
            Install Anki by clicking this link
          </a>{" "}
          if you do not have it installed already.
        </li>

        <li>
          Install the AnkiConnect plugin, by using the plugin code{" "}
          <code>2055492159</code> or by clicking{" "}
          <a href="https://ankiweb.net/shared/info/2055492159" target="_blank">
            on this link for further information.
          </a>{" "}
          You will find more documentation about AnkiConnect{" "}
          <a href="https://foosoft.net/projects/anki-connect/" target="_blank">
            on this website
          </a>
          .
        </li>
        <li>
          <div>
            Once you have AnkiConnect installed, you may try to request
            connection permission.
          </div>
          <div className="mt-3">
            {!ankiRequestPermission.isSuccess && (
              <Button
                onClick={async () => {
                  try {
                    await ankiRequestPermission
                      .mutateAsync()
                      .then((data) => console.log(data));
                  } catch (error) {}
                }}
              >
                Try to request permission{" "}
                {ankiRequestPermission.failureCount > 0 && "again"}
              </Button>
            )}
            {ankiRequestPermission.isSuccess && (
              <div>
                <Alert className="bg-green-600">
                  <IconCheck className="h-4 w-4"></IconCheck>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Successful! You are all set!
                  </AlertDescription>
                </Alert>
                <Button asChild className="mt-3">
                  <Link to="/">Go to card creator</Link>
                </Button>
              </div>
            )}
            {ankiRequestPermission.isError && (
              <div>
                <Alert className="bg-red-600 my-3">
                  <IconX className="h-4 w-4"></IconX>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Permission request failed.
                  </AlertDescription>
                </Alert>

                <div>
                  <h3>Apparently, there is a problem. </h3>
                  <p>
                    Have you tried the follwing steps? You can try to request
                    permssion again by using the button above if you made any
                    changes.
                  </p>
                  <ul>
                    <li>Is Anki open?</li>
                    <li>Have you tried restarting Anki?</li>
                  </ul>
                  <p>
                    In some cases, the request permission window might not open
                    in Anki. In this case, you will need to edit the addon
                    configuration manually. Click on{" "}
                    <code>Code &gt; Addons &gt; AnkiConnect &gt; Config </code>
                    <br />
                    This will open the AnkiConnect configuration. Paste (or
                    change to match) the follwing:
                    <br />
                    <pre>
                      {`{
    "apiKey": null,
    "apiLogPath": null,
    "ignoreOriginList": [],
    "webBindAddress": "127.0.0.1",
    "webBindPort": 8765,
    "webCorsOriginList": [
        "${host}"
    ]
}`}
                    </pre>
                    <p>
                      It is important that you add <code>"{host}"</code> under{" "}
                      <code>webCorsOriginList</code>.
                    </p>
                    <p>
                      To save the settings, click on <code>Ok</code>. Try
                      requesting permssion again.
                    </p>
                  </p>
                </div>
              </div>
            )}
          </div>
        </li>
      </ol>
      <p></p>
    </div>
  );
}
