import { useEffect, useState } from "react";
import { Button, Card, Text } from "@shopify/polaris";

export function WelcomeCard({
  redirectToThemeEditor,
  redirectToPlan,
  // isEmbeddedApp,
  isPlanUpgraded,
}) {
  const [openStep, setOpenStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(1);

  const isEmbeddedApp = false;

  useEffect(() => {
    if (isPlanUpgraded !== "") {
      setCompletedSteps(2);
    }
    if (isPlanUpgraded !== "" && isEmbeddedApp) {
      setCompletedSteps(3);
    }
  }, [isEmbeddedApp, isPlanUpgraded]);

  const toggleStep = (step) => {
    setOpenStep(step);
  };

  // Calculate progress percentage
  const progressPercentage = (completedSteps / 3) * 100;

  return (
    <>
      <Card>
        {/* Header Section */}
        <div>
          <Text variant="headingMd" fontWeight="bold">
            Welcome to AI Search: Visual Search !
          </Text>

          <p style={{ margin: "6px 0" }}>
            Please complete the following steps to configure the application. If
            you need help, please check{" "}
            <a href="/app/help" style={{ textDecoration: "none" }}>
              help
            </a>{" "}
            or contact us:
          </p>

          {/* Progress Bar */}
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                height: "6px",
                backgroundColor: "#e4e5e7",
                borderRadius: "2px",
                marginBottom: "8px",
                flex: 1,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercentage}%`,
                  backgroundColor: "#008060",
                  borderRadius: "2px",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "#6d7175",
                marginBottom: "0",
              }}
            >
              {completedSteps}/3 Start!
            </p>
          </div>
        </div>

        {/* Step 1 */}
        <div>
          <div
            onClick={() => toggleStep(1)}
            style={{
              padding: "16px 0px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {completedSteps >= 0 ? (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  bis_size='{"x":40,"y":188,"w":20,"h":20,"abs_x":280,"abs_y":300}'
                >
                  <svg
                    viewBox="0 0 20 20"
                    width="30"
                    bis_size='{"x":40,"y":188,"w":20,"h":20,"abs_x":280,"abs_y":300}'
                  >
                    <path
                      d="M13.28 9.03a.75.75 0 0 0-1.06-1.06l-2.97 2.97-1.22-1.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.5-3.5Z"
                      bis_size='{"x":46,"y":195,"w":6,"h":4,"abs_x":286,"abs_y":307}'
                    ></path>
                    <path
                      fill-rule="evenodd"
                      d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                      bis_size='{"x":43,"y":191,"w":14,"h":14,"abs_x":283,"abs_y":303}'
                    ></path>
                  </svg>
                </div>
              ) : (
                <div
                  class="_unfinished-circle_y0zy0_246"
                  bis_size='{"x":211,"y":352,"w":20,"h":20,"abs_x":451,"abs_y":464}'
                  style={{
                    border: "2px dashed #616161",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                ></div>
              )}
            </div>
            <Text variant="headingSm">Step 1: App Installed Successfully</Text>
          </div>

          {openStep === 1 && (
            <div
              style={{
                padding: "0 0px 10px 30px",
                // fontSize: "14px",
                lineHeight: "20px",
                color: "#202223",
              }}
            >
              <p>
                Thanks for installing our app! We're excited to help you get the
                most out of your store.
              </p>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div>
          <div
            onClick={() => toggleStep(2)}
            style={{
              padding: "16px 0px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {completedSteps && isEmbeddedApp >= 1 ? (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  bis_size='{"x":40,"y":188,"w":20,"h":20,"abs_x":280,"abs_y":300}'
                >
                  <svg
                    viewBox="0 0 20 20"
                    width="30"
                    bis_size='{"x":40,"y":188,"w":20,"h":20,"abs_x":280,"abs_y":300}'
                  >
                    <path
                      d="M13.28 9.03a.75.75 0 0 0-1.06-1.06l-2.97 2.97-1.22-1.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.5-3.5Z"
                      bis_size='{"x":46,"y":195,"w":6,"h":4,"abs_x":286,"abs_y":307}'
                    ></path>
                    <path
                      fill-rule="evenodd"
                      d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                      bis_size='{"x":43,"y":191,"w":14,"h":14,"abs_x":283,"abs_y":303}'
                    ></path>
                  </svg>
                </div>
              ) : (
                <div
                  class="_unfinished-circle_y0zy0_246"
                  bis_size='{"x":211,"y":352,"w":20,"h":20,"abs_x":451,"abs_y":464}'
                  style={{
                    border: "2px dashed #616161",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                ></div>
              )}
            </div>

            <Text variant="headingSm">Step 2: Enable the Apps Embed</Text>
          </div>

          {openStep === 2 && (
            <div
              style={{
                padding: "0 20px 20px 30px",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#202223",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 33.333%", paddingRight: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <Text fontWeight="regular" variant="headingSm">
                      Enable Image Search Float
                    </Text>
                    <Text fontWeight="regular" variant="headingSm">
                      Enable Search Suggestion Bar
                    </Text>
                    <Text fontWeight="regular" variant="headingSm">
                      Enable Image Search Bar Icon
                    </Text>
                    <div>
                      <Button variant="primary" onClick={redirectToThemeEditor}>
                        Open theme editor
                      </Button>
                    </div>
                  </div>
                </div>

                <div style={{ flex: "0 0 66.666%" }}>
                  <img
                    src="https://platformplugin.biggo.com/assets/img-search-float-a1bee37d.png"
                    alt="Theme editor preview"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #e1e3e5",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div>
          <div
            onClick={() => toggleStep(3)}
            style={{
              padding: "16px 0px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {completedSteps >= 2 ? (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  bis_size='{"x":40,"y":188,"w":20,"h":20,"abs_x":280,"abs_y":300}'
                >
                  <svg
                    viewBox="0 0 20 20"
                    width="30"
                    bis_size='{"x":40,"y":188,"w":20,"h":20,"abs_x":280,"abs_y":300}'
                  >
                    <path
                      d="M13.28 9.03a.75.75 0 0 0-1.06-1.06l-2.97 2.97-1.22-1.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.5-3.5Z"
                      bis_size='{"x":46,"y":195,"w":6,"h":4,"abs_x":286,"abs_y":307}'
                    ></path>
                    <path
                      fill-rule="evenodd"
                      d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                      bis_size='{"x":43,"y":191,"w":14,"h":14,"abs_x":283,"abs_y":303}'
                    ></path>
                  </svg>
                </div>
              ) : (
                <div
                  class="_unfinished-circle_y0zy0_246"
                  bis_size='{"x":211,"y":352,"w":20,"h":20,"abs_x":451,"abs_y":464}'
                  style={{
                    border: "2px dashed #616161",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                ></div>
              )}
            </div>
            <Text variant="headingSm">
              Step : Upgrade to get Limitless Features
            </Text>
          </div>

          {openStep === 3 && (
            <div
              style={{
                padding: "0 20px 20px 30px",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#202223",
              }}
            >
              <Text variant="headingSm" fontWeight="regular">
                Choose a plan that suits your number of products.
                <br />
                Don't worry! You will receive a 14-day free trial after the plan
                is approved!
              </Text>

              <div style={{ marginTop: "10px" }}>
                <Button variant="primary" url="/app/plan">
                  Choose a plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
